/**
 * WhatsApp Cloud API OTP dispatch via Meta Graph API.
 * Supports standard Meta Authentication Templates with Copy Code buttons.
 */

const WHATSAPP_TOKEN = (process.env.WHATSAPP_TOKEN || '').trim();
const WHATSAPP_PHONE_NUMBER_ID = (process.env.WHATSAPP_PHONE_NUMBER_ID || '').trim();
const WHATSAPP_TEMPLATE_NAME = (process.env.WHATSAPP_TEMPLATE_NAME || 'auth_otp_code').trim();
const WHATSAPP_TEMPLATE_LANG = (process.env.WHATSAPP_TEMPLATE_LANG || 'en_US').trim();
const DEFAULT_COUNTRY_CODE = (process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || '91').trim();

const AUTH_DEV_MODE = String(process.env.AUTH_DEV_MODE || 'false').toLowerCase();
const DEV_MODE = AUTH_DEV_MODE !== 'false' && AUTH_DEV_MODE !== '0' && AUTH_DEV_MODE !== 'no';

export function isWhatsAppConfigured() {
  return Boolean(WHATSAPP_TOKEN && WHATSAPP_PHONE_NUMBER_ID);
}

export function formatWhatsAppPhone(raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (d.length === 10) return `${DEFAULT_COUNTRY_CODE}${d}`;
  if (d.length === 11 && d.startsWith('0')) return `${DEFAULT_COUNTRY_CODE}${d.slice(1)}`;
  return d;
}

export async function sendWhatsAppOtp({ phone, otp }) {
  const recipient = formatWhatsAppPhone(phone);
  if (!isWhatsAppConfigured()) {
    if (DEV_MODE) {
      console.log(`[AUTH_DEV_MODE] WhatsApp OTP for +${recipient}: ${otp} (credentials not set)`);
      return { ok: false, dev: true, reason: 'whatsapp-not-configured', recipient };
    }
    console.log(`[WhatsApp] Credentials not configured. Skipping WhatsApp delivery for +${recipient}.`);
    return { ok: false, reason: 'whatsapp-not-configured', recipient };
  }

  const url = `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const payloadWithButton = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: recipient,
    type: 'template',
    template: {
      name: WHATSAPP_TEMPLATE_NAME,
      language: { code: WHATSAPP_TEMPLATE_LANG },
      components: [
        {
          type: 'body',
          parameters: [{ type: 'text', text: String(otp) }],
        },
        {
          type: 'button',
          sub_type: 'url',
          index: '0',
          parameters: [{ type: 'text', text: String(otp) }],
        },
      ],
    },
  };

  try {
    const sendDirectText = async () => {
      const textPayload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient,
        type: 'text',
        text: {
          preview_url: false,
          body: `Your Smriti Saarthi verification code is: ${otp}\n\nValid for 5 minutes. If you did not request this, please ignore.`,
        },
      };
      const textRes = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(textPayload),
      });
      if (textRes.ok) {
        const d = await textRes.json();
        const messageId = d?.messages?.[0]?.id || '';
        console.log(`[WhatsApp] Direct text OTP sent to +${recipient} (id: ${messageId})`);
        return { ok: true, messageId, recipient };
      }
      const err = await textRes.text();
      return { ok: false, reason: err, recipient };
    };

    if (!WHATSAPP_TEMPLATE_NAME) {
      return await sendDirectText();
    }

    let res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payloadWithButton),
    });

    if (!res.ok) {
      const errText = await res.text();
      // If template lacks button component in Meta configuration, retry with body-only
      if (errText.toLowerCase().includes('button')) {
        const bodyOnlyPayload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipient,
          type: 'template',
          template: {
            name: WHATSAPP_TEMPLATE_NAME,
            language: { code: WHATSAPP_TEMPLATE_LANG },
            components: [
              {
                type: 'body',
                parameters: [{ type: 'text', text: String(otp) }],
              },
            ],
          },
        };
        const retryRes = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyOnlyPayload),
        });
        if (retryRes.ok) {
          const data = await retryRes.json();
          const messageId = data?.messages?.[0]?.id || '';
          console.log(`[WhatsApp] OTP sent to +${recipient} without button (id: ${messageId})`);
          return { ok: true, messageId, recipient };
        }
      }
      // Fall back to direct text
      try {
        console.log(`[WhatsApp] Template send failed. Falling back to direct text message...`);
        return await sendDirectText();
      } catch (textErr) {
        console.error('[WhatsApp Fallback Text Failed]:', textErr);
      }
      console.error(`[WhatsApp API Error ${res.status}]:`, errText);
      return { ok: false, reason: errText, recipient };
    }

    const data = await res.json();
    const messageId = data?.messages?.[0]?.id || '';
    console.log(`[WhatsApp] OTP sent to +${recipient} (id: ${messageId})`);
    return { ok: true, messageId, recipient };
  } catch (err) {
    console.error('[WhatsApp Send Failed]:', err);
    return { ok: false, reason: err.message, recipient };
  }
}
