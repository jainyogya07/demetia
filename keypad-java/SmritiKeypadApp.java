/**
 * Offline keypad care app for low-cost hardware (PC / Raspberry Pi / ASHA laptop).
 * Java 11+: javac SmritiKeypadApp.java && java SmritiKeypadApp
 * Same 0–9 protocol as SMS/USSD. Local JSON store; optional HTTP sync to :8010.
 */
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Font;
import java.awt.GridLayout;
import java.awt.Insets;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;
import javax.swing.WindowConstants;

public class SmritiKeypadApp {
    private static final Path STORE = Path.of(System.getProperty("user.home"), ".smriti-keypad.json");
    private static final Color INK = new Color(0x21, 0x4d, 0x42);
    private static final Color SAGE = new Color(0x17, 0x6b, 0x58);
    private static final Color SAND = new Color(0xf4, 0xf7, 0xf5);

    private final JTextArea screen = new JTextArea();
    private final JTextField phone = new JTextField("9810112345");
    private final JLabel meta = new JLabel("Offline-first · local file");
    private final List<String> pending = new ArrayList<>(List.of("med-am", "water", "brain", "lunch", "walk", "med-pm"));
    private final List<String> outbox = new ArrayList<>();
    private String lang = "hi";
    private String state = "menu";

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new SmritiKeypadApp().show());
    }

    private void show() {
        load();
        JFrame frame = new JFrame("Smriti Saarthi · Keypad");
        frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        frame.getContentPane().setBackground(SAND);
        frame.setLayout(new BorderLayout(12, 12));

        JLabel title = new JLabel("  स्मृति सारथी  ·  keypad care for 2G / kiosk");
        title.setFont(new Font("SansSerif", Font.BOLD, 18));
        title.setForeground(INK);
        title.setBorder(BorderFactory.createEmptyBorder(12, 8, 4, 8));

        screen.setEditable(false);
        screen.setFont(new Font("SansSerif", Font.PLAIN, 16));
        screen.setMargin(new Insets(12, 12, 12, 12));
        screen.setLineWrap(true);
        screen.setWrapStyleWord(true);

        JPanel keys = new JPanel(new GridLayout(4, 3, 8, 8));
        keys.setOpaque(false);
        String[][] pad = {
            {"1", "Today"}, {"2", "Done"}, {"3", "Alerts"},
            {"4", "Call"}, {"5", "I am OK"}, {"6", "Meds"},
            {"7", "SOS"}, {"8", "Lang"}, {"9", "Home"},
            {"*", "Menu"}, {"0", "Help"}, {"#", "112"}
        };
        for (String[] cell : pad) {
            JButton b = new JButton("<html><center><b>" + cell[0] + "</b><br>" + cell[1] + "</center></html>");
            b.setFont(new Font("SansSerif", Font.PLAIN, 14));
            b.addActionListener(e -> go(cell[0]));
            keys.add(b);
        }

        JPanel south = new JPanel(new BorderLayout(8, 8));
        south.setOpaque(false);
        phone.setFont(new Font("SansSerif", Font.PLAIN, 16));
        south.add(phone, BorderLayout.NORTH);
        south.add(keys, BorderLayout.CENTER);
        south.add(meta, BorderLayout.SOUTH);

        JPanel root = new JPanel(new BorderLayout(12, 12));
        root.setBackground(SAND);
        root.setBorder(BorderFactory.createEmptyBorder(8, 16, 16, 16));
        root.add(title, BorderLayout.NORTH);
        root.add(new JScrollPane(screen), BorderLayout.CENTER);
        root.add(south, BorderLayout.SOUTH);

        frame.setContentPane(root);
        frame.setSize(420, 720);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
        go("");
    }

    private void go(String body) {
        String reply = handle(body == null ? "" : body.trim());
        screen.setText(reply);
        meta.setText(pending.size() + " due · " + outbox.size() + " queued · " + lang);
        save();
        syncQuiet(phone.getText(), body);
    }

    private String handle(String t) {
        String low = t.toLowerCase();
        if (t.isEmpty() || "*".equals(t) || "0".equals(t)) {
            state = "menu";
            return menu();
        }
        if ("1".equals(t)) {
            state = "ack";
            return today();
        }
        if ("2".equals(t) && !pending.isEmpty()) {
            String id = pending.remove(0);
            outbox.add("ack:" + id);
            state = "menu";
            return "Done: " + id + "\n\n" + today();
        }
        if ("3".equals(t)) return "Home zone safe.\nASHA: BP 128/78, same dose.";
        if ("4".equals(t)) {
            state = "call";
            return "1 Rina 9435011820\n2 Doom 9864022118\n3 ASHA 6001244890\n4 Dr Sharma 03762371040\nH Helplines 112 108 100 101 102 104 181 1091 1098 14567 14416 18008914416 14490 15100";
        }
        if ("call".equals(state) && t.matches("\\d+")) {
            state = "menu";
            Map<String, String> map = new LinkedHashMap<>();
            map.put("1", "Rina 9435011820");
            map.put("2", "Doom 9864022118");
            map.put("3", "ASHA 6001244890");
            map.put("4", "Dr Sharma 03762371040");
            map.put("5", "Emergency 112");
            return "Call " + map.getOrDefault(t, "unknown");
        }
        if ("5".equals(t)) { outbox.add("checkin"); return "I am OK saved offline."; }
        if ("6".equals(t)) return pending.stream().filter(x -> x.contains("med") || x.equals("ca")).findFirst().map(x -> "Next medicine: " + x).orElse("No medicine due.");
        if ("7".equals(t) || "#".equals(t)) { outbox.add("sos"); return "SOS saved. Call 112 now.\nRina 9435011820"; }
        if ("8".equals(t)) { lang = "as".equals(lang) ? "en" : "hi".equals(lang) ? "as" : "hi"; return "Language: " + lang + "\n\n" + menu(); }
        if ("9".equals(t)) return "Home courtyard — safe.";
        if ("h".equals(low) || "helpline".equals(low) || "helplines".equals(low)) {
            state = "menu";
            return "Helplines\n112 Emergency\n108 Ambulance\n100 Police\n101 Fire\n102 Ambulance\n104 Health\n181 Women\n1091 Women police\n1098 Childline\n14567 Elderline\n14416 Tele-MANAS\n18008914416 Tele-MANAS TF\n14490 Legal aid\n15100 Senior";
        }
        if ("ack".equals(state) && t.matches("\\d+")) {
            int i = Integer.parseInt(t) - 1;
            if (i >= 0 && i < pending.size()) {
                String id = pending.remove(i);
                outbox.add("ack:" + id);
            }
            state = "menu";
            return today();
        }
        return menu();
    }

    private String menu() {
        if ("hi".equals(lang)) {
            return "स्मृति सारथी\n1 आज  2 अगला हो गया\n3 खबर  4 कॉल\n5 मैं ठीक हूँ  6 दवाई\n7 SOS  8 भाषा\n9 घर  0 मदद";
        }
        if ("as".equals(lang)) {
            return "স্মৃতি সাৰথী\n1 আজি  2 পৰৱৰ্তী\n3 খবৰ  4 কল\n5 মই ঠিক  6 দৰব\n7 SOS  8 ভাষা\n9 ঘৰ  0 সহায়";
        }
        return "Smriti Saarthi\n1 Today  2 Next done\n3 Alerts  4 Call\n5 I am OK  6 Next med\n7 SOS  8 Language\n9 Safe zone  0 Help\nH Helplines";
    }

    private String today() {
        if (pending.isEmpty()) return "All done for now.\n\n" + menu();
        StringBuilder sb = new StringBuilder("Today\nNext: ").append(pending.get(0)).append("\n\n");
        for (int i = 0; i < pending.size(); i++) {
            sb.append(i + 1).append(". ").append(pending.get(i)).append('\n');
        }
        sb.append("\nSend a number to mark done.");
        return sb.toString();
    }

    private void load() {
        try {
            if (!Files.exists(STORE)) return;
            String raw = Files.readString(STORE);
            pending.clear();
            for (String part : raw.split("pending=")[1].split(";")[0].split(",")) {
                if (!part.isBlank()) pending.add(part.trim());
            }
            if (pending.equals(List.of("ca", "story", "walk", "pm-med"))) {
                pending.clear();
                pending.addAll(List.of("med-am", "water", "brain", "lunch", "walk", "med-pm"));
            }
        } catch (Exception ignored) {
            /* first run */
        }
    }

    private void save() {
        try {
            Files.writeString(STORE, "pending=" + String.join(",", pending) + ";outbox=" + outbox.size(), StandardCharsets.UTF_8);
        } catch (IOException ignored) {
            /* still usable in memory */
        }
    }

    private void syncQuiet(String from, String body) {
        if (body == null || body.isBlank()) return;
        Thread t = new Thread(() -> {
            try {
                HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(2)).build();
                HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create("http://127.0.0.1:8010/sms/inbound?From=" + from + "&Body=" + body))
                    .timeout(Duration.ofSeconds(3))
                    .GET()
                    .build();
                client.send(req, HttpResponse.BodyHandlers.ofString());
            } catch (Exception ignored) {
                /* offline is the default */
            }
        });
        t.setDaemon(true);
        t.start();
    }
}
