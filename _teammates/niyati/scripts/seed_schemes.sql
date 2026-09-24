-- Seed 124 schemes from src/data/schemes.js + data/schemes-banners.json
-- English Excel text. No passwords. Run after schema.sql
-- psql "$DATABASE_URL" -f scripts/schema.sql -f scripts/seed_schemes.sql

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1001', 'Indira Gandhi National Widow Pension Scheme (IGNWPS)', 'pension', 'Monthly Pension', 'Central / All India', 'Widow, family below poverty line (BPL), not remarried, not receiving another govt pension', 'Direct monthly financial support under NSAP for destitute widows. Rs 300/month from Centre (states top up). Base national scheme under NSAP; most states add a top-up on this. Age range: 40-79 (auto-shifts to Old Age Pension at 80). Income limit: BPL household. Verify amount on nsap.nic.in before demo.', ARRAY['Aadhaar', 'Death Certificate', 'BPL Card', 'Bank Passbook'], '₹300/month (age 40-79), ₹500/month (age 80+) + State Top-ups', 'https://www.myscheme.gov.in/schemes/ignwps', 'https://nsap.nic.in/', 3, 'Online', TRUE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1002', 'Pradhan Mantri Awas Yojana - Gramin (Widow / Single Women Priority)', 'housing', 'Housing / Infrastructure', 'Central / All India', 'Homeless/kuchha house living widows listed under SECC 2011 / Awas+ priority.', 'Priority housing financial assistance for constructing a permanent pucca house.', ARRAY['Aadhaar', 'Death Certificate', 'SECC Priority ID', 'Bank Account'], '₹1,20,000 (Plains) to ₹1,30,000 (Hilly/NE states) grant for pucca house', 'https://www.myscheme.gov.in/search?q=Central%20widow', 'https://pmayg.nic.in/netiay/images/logo.png', 5, 'See application portal', TRUE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1003', 'National Family Benefit Scheme (NFBS)', 'pension', 'One-Time Financial Grant', 'Central / All India', 'BPL family upon death of breadwinner aged 18-59 years.', 'Immediate lump-sum survival grant to widow on sudden demise of the primary breadwinner.', ARRAY['Death Certificate', 'BPL Proof', 'Age proof of deceased', 'Bank Passbook'], '₹20,000 one-time lump sum grant on death of primary breadwinner', 'https://www.myscheme.gov.in/schemes/nfbs', 'https://nsap.nic.in/', 3, 'See application portal', TRUE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1004', 'Support to Training and Employment Programme for Women (STEP)', 'employment', 'Skill & Livelihood', 'Central / All India', 'Marginalized women, widows, and artisans aged 16+ years.', 'Skill training in sectors like agriculture, handicrafts, tailoring to ensure self-reliance.', ARRAY['Aadhaar', 'Education Certificate (if any)', 'Self-declaration'], 'Free vocational training, skill upgradation, and market linkage support', 'https://www.myscheme.gov.in/search?q=Central%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1005', 'Pradhan Mantri Matru Vandana Yojana (PMMVY) - Special Provision', 'health', 'Maternity Benefit', 'Central / All India', 'Pregnant/lactating women including destitute/widowed mothers under prescribed income norms.', 'Cash incentive for nutritional support and health checkups.', ARRAY['MCP Card', 'Aadhaar', 'Bank Details'], '₹5,000 in DBT installments for institutional care & nutrition', 'https://www.myscheme.gov.in/schemes/pmmvy', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 2, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1006', 'Prime Minister''s Scholarship Scheme (PMSS) for Wards of Deceased CAPF/Assam Rifles/Police', 'education', 'Education Grant', 'Central / All India', 'Dependent children and widows of deceased CAPF, AR, and State Police personnel.', 'Monthly financial scholarship covering professional degree education tuition.', ARRAY['Discharge/Death in action Certificate', 'Admission Proof', 'Marksheets', 'Aadhaar'], '₹3,000/month for girls, ₹2,500/month for boys for professional degree courses', 'https://www.myscheme.gov.in/search?q=Central%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1007', 'NALSA - Free Legal Aid Scheme for Women & Widows', 'legal', 'Free Legal Aid', 'Central / All India', 'All women and widows irrespective of their income ceiling under Section 12 of LSA Act.', 'Complete free litigation support, maintenance claim filing, and property succession aid.', ARRAY['Aadhaar / ID proof', 'case application form'], '100% free legal counsel, court representation, and documentation aid', 'https://nalsa.gov.in/services/legal-aid', 'https://nalsa.gov.in/', 0, 'See application portal', TRUE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1008', 'Swadhar Greh Scheme (Support for Women in Difficult Circumstances)', 'housing', 'Shelter & Rehabilitation', 'Central / All India', 'Widow / divorced / separated / destitute / abandoned women resident in Delhi', 'Institutional rehabilitation providing safe shelter and psychosocial counseling. Check current amount on WCD Delhi portal. Delhi allows applications from age 18, broader than many states. Age range: 18+. Income limit: Income-based, check current threshold on portal. Verify exact amount before demo.', ARRAY['Death certificate', 'Aadhaar', 'residence proof', 'income certificate'], 'Free food, clothing, shelter, medical care, and vocational training in shelter homes', 'https://www.myscheme.gov.in/search?q=Central%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 0, 'Online via Delhi e-District portal', TRUE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1009', 'Deendayal Antyodaya Yojana - NRLM (SHG Bank Linkage for Destitute Women)', 'employment', 'Microfinance / Livelihood', 'Central / All India', 'Vulnerable rural women and widows organized into SHGs.', 'Revolving funds and low-interest credit for launching micro-enterprises and dairy/farming.', ARRAY['SHG membership', 'Aadhaar', 'Bank Account'], 'Collateral-free subsidized credit up to ₹10 Lakhs for Self Help Groups', 'https://www.myscheme.gov.in/schemes/aay', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1010', 'National Safai Karamcharis Finance & Development Corp - Loan to Widows', 'employment', 'Subsidized Loan', 'Central / All India', 'Widows of sanitation workers / Safai Karamcharis.', 'Term loans for enterprise setup and small business creation.', ARRAY['Caste/Occupation Certificate', 'Death Certificate', 'Project Proposal'], 'Concessional loan up to ₹5 Lakhs at low interest (4-6% p.a.) with capital subsidy', 'https://www.myscheme.gov.in/search?q=Central%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1011', 'UP Vidhwa Pension Yojana', 'pension', 'Monthly Pension', 'Uttar Pradesh', 'Age 18+, UP resident, annual family income <= ₹2,00,000', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Uttar Pradesh. Amount revised upward in recent budget cycles - verify current figure. UP has one of the largest beneficiary bases nationally. Age range: 18-59 (state scheme). Income limit: Rural/urban income ceiling, check current cap on portal. Verify current amount, changed after recent budget revision.', ARRAY['Aadhaar', 'Death Certificate', 'Income Certificate', 'Bank Details'], '₹1,000/month', 'https://www.myscheme.gov.in/schemes/wpup', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'Online via UP Samajik Suraksha Portal (sspy-up.gov.in)', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1012', 'Sanjay Gandhi Niradhar Anudan Yojana', 'pension', 'Monthly Pension', 'Maharashtra', 'Age 18+, Maharashtra resident 15 yrs, annual income < ₹21k-₹50k', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Maharashtra. Rs 300 (Centre) + Rs 1200 (State) = Rs 1500/month total. Confirmed on Maharashtra Social Justice Dept official site. Age range: 40-79. Income limit: BPL. Verified from official portal.', ARRAY['Aadhaar', 'Domicile', 'Death Certificate', 'Income Certificate'], '₹1,500/mo (up to ₹2,500 with 2+ minor children)', 'https://www.myscheme.gov.in/search?q=Maharashtra%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'Online/Offline via Tehsil/District Social Welfare Office', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1013', 'Destitute Widow Pension Scheme (DWPS)', 'pension', 'Monthly Pension', 'Tamil Nadu', 'Age 18+, Destitute widow, fixed assets <= ₹1 Lakh', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Tamil Nadu. Rs 1000-1300/month; Rs 1500/month for widows aged 80+. TN combines state scheme with central IGNWPS. Age range: 18+ (state), 40-79 (central component). Income limit: Destitute / income-based. Verified from scheme aggregator, cross-check official site.', ARRAY['Destitute Widow Certificate', 'Aadhaar', 'Death Cert', 'Smart Ration Card'], '₹1,000/month + Free Rice & Clothing', 'https://www.myscheme.gov.in/schemes/dwps', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'Offline via Taluk Social Welfare Office or e-Sevai centre', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1014', 'Delhi Financial Assistance to Women in Distress (Widow Pension)', 'pension', 'Monthly Pension', 'Delhi', 'Widow / divorced / separated / destitute / abandoned women resident in Delhi', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Delhi. Check current amount on WCD Delhi portal. Delhi allows applications from age 18, broader than many states. Age range: 18+. Income limit: Income-based, check current threshold on portal. Verify exact amount before demo.', ARRAY['Aadhaar', 'Death Certificate', '5yr Residence Proof', 'Bank Details'], '₹2,500/month', 'https://www.myscheme.gov.in/schemes/dpswdwp', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'Online via Delhi e-District portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1015', 'Widow & Destitute Women Pension Scheme', 'pension', 'Monthly Pension', 'Haryana', 'Widow / divorced / separated / destitute / abandoned women resident in Delhi', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Haryana. Check current amount on WCD Delhi portal. Delhi allows applications from age 18, broader than many states. Age range: 18+. Income limit: Income-based, check current threshold on portal. Verify exact amount before demo.', ARRAY['Death certificate', 'Aadhaar', 'residence proof', 'income certificate'], '₹3,000/month', 'https://www.myscheme.gov.in/search?q=Haryana%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'Online via Delhi e-District portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1016', 'Financial Assistance to Widows and Destitute Women', 'pension', 'Monthly Pension', 'Punjab', 'Age < 58 yrs, Punjab resident, annual family income < ₹60,000', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Punjab.', ARRAY['Aadhaar', 'Death Certificate', 'Income Proof', 'Bank Passbook'], '₹1,500/month', 'https://www.myscheme.gov.in/search?q=Punjab%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1017', 'Mukhyamantri Ekal Nari Samman Pension Yojana', 'pension', 'Monthly Pension', 'Rajasthan', 'Age 18+, Rajasthan resident, annual income < ₹48,000', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Rajasthan.', ARRAY['Jan Aadhaar', 'Aadhaar', 'Death Certificate', 'Bank Account'], '₹1,000 - ₹1,500/month (by age tier)', 'https://www.myscheme.gov.in/search?q=Rajasthan%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1018', 'Sandhya Suraksha / Destitute Widow Pension', 'pension', 'Monthly Pension', 'Karnataka', 'Age 18+, Karnataka resident, income < ₹12k (rural)/₹17k (urban)', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Karnataka.', ARRAY['Aadhaar', 'Death Certificate', 'Income/Caste Certificate', 'Ration Card'], '₹800/month', 'https://www.myscheme.gov.in/search?q=Karnataka%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1019', 'YSR Pension Kanuka / Widow Pension', 'pension', 'Monthly Pension', 'Andhra Pradesh', 'Age 18+, AP resident, White Rice Card / BPL income', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Andhra Pradesh.', ARRAY['White Ration Card', 'Aadhaar', 'Death Certificate', 'Bank Account'], '₹3,000/month', 'https://www.myscheme.gov.in/search?q=Andhra%20Pradesh%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1020', 'Aasara Pension for Widows', 'pension', 'Monthly Pension', 'Telangana', 'Age 18+, BPL household, Telangana resident', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Telangana.', ARRAY['Food Security Card', 'Death Certificate', 'Aadhaar', 'Bank Details'], '₹2,016/month', 'https://www.myscheme.gov.in/search?q=Telangana%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1021', 'Destitute / Widow Pension (Sevana)', 'pension', 'Monthly Pension', 'Kerala', 'Kerala resident, annual family income < ₹1,00,000, not in old age home', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Kerala. Check current amount with local body - administered locally, not centralized. Unusual structure: administration decentralized to Local Self Govt since 1997. Age range: As per LSG rules, generally 18+. Income limit: Assessed by Grama Panchayat/Municipality. Confirm current amount with LSG department.', ARRAY['Aadhaar', 'Death Certificate', 'Village Officer Income Cert'], '₹1,600/month', 'https://www.myscheme.gov.in/search?q=Kerala%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'Offline - apply to Grama Panchayat/Municipality/Corporation Secretary', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1022', 'Ganga Swarupa Yojana (Vidhav Sahay)', 'pension', 'Monthly Pension', 'Gujarat', 'Age 18+, Gujarat resident, income < ₹1.2L (rural) / ₹1.5L (urban)', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Gujarat.', ARRAY['Ganga Swarupa Certificate', 'Death Cert', 'Income Proof', 'Aadhaar'], '₹1,250/month', 'https://www.myscheme.gov.in/search?q=Gujarat%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1023', 'Indira Gandhi Kalyani Pension / Vidhwa Pension', 'pension', 'Monthly Pension', 'Madhya Pradesh', 'Age 18-79 yrs, MP resident, BPL / Samagra registered', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Madhya Pradesh.', ARRAY['Samagra ID', 'Aadhaar', 'Death Certificate', 'BPL Card'], '₹600/month', 'https://www.myscheme.gov.in/search?q=Madhya%20Pradesh%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1024', 'Laxmibai Samajik Suraksha Pension Yojana', 'pension', 'Monthly Pension', 'Bihar', 'Age 18+, Bihar resident, family annual income < ₹60,000 or BPL', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Bihar.', ARRAY['BPL Certificate / Income Proof', 'Death Certificate', 'Aadhaar'], '₹400 - ₹500/month', 'https://www.myscheme.gov.in/search?q=Bihar%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1025', 'Widow Pension Scheme', 'pension', 'Monthly Pension', 'West Bengal', 'WB resident, destitute status, monthly family income < ₹1,000', 'Direct monthly financial pension assistance disbursed to verified eligible widows across West Bengal. To be verified on state portal. Not fully verified in this pass - flag as pending research. Age range: To be verified on state portal. Income limit: Income-based. NEEDS VERIFICATION.', ARRAY['Aadhaar', 'Death Certificate', 'Local Authority Certificate'], '₹1,000/month', 'https://www.myscheme.gov.in/search?q=West%20Bengal%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'Online/Offline', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1026', 'Madhu Babu Pension Yojana (MBPY - Widow)', 'pension', 'Monthly Pension', 'Odisha', 'Age 18+, Odisha resident, family income < ₹24,000/yr', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Odisha.', ARRAY['Aadhaar', 'Death Certificate', 'Income Certificate', 'Bank Details'], '₹1,000 - ₹1,200/month', 'https://www.myscheme.gov.in/search?q=Odisha%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1027', 'Indira Miri Universal Widow Pension Scheme', 'pension', 'Monthly Pension', 'Assam', 'Age 18-59 yrs, Assam resident, family income < ₹5,00,000/yr', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Assam. Rs 300/month (40-79), Rs 500/month (80+); one-time Rs 25,000 under Indira Miri scheme. Also check Orunodoi 3.0 for additional household support. Age range: 40-79 (statutory); one-time aid separate. Income limit: Household income based. Verify locally, offline-only process.', ARRAY['Aadhaar', 'Death Certificate', 'Income Proof', 'Bank Details'], '₹300/month + ₹25,000 one-time grant', 'https://www.myscheme.gov.in/search?q=Assam%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'Offline only, via Gaon Panchayat or Ward Office', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1028', 'HP Widow / Destitute Women Pension', 'pension', 'Monthly Pension', 'Himachal Pradesh', 'Age 18+, HP resident, annual income < ₹35,000 (or destitute)', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Himachal Pradesh.', ARRAY['Parivar Register Copy', 'Death Cert', 'Income Proof', 'Aadhaar'], '₹1,500/month', 'https://www.myscheme.gov.in/schemes/wdenp', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1029', 'Vidhwa Pension Yojana', 'pension', 'Monthly Pension', 'Uttarakhand', 'Age 18+, Uttarakhand resident, BPL or income < ₹4,000/month', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Uttarakhand.', ARRAY['Aadhaar', 'Death Certificate', 'BPL/Income Proof', 'Bank Passbook'], '₹1,500/month', 'https://www.myscheme.gov.in/search?q=Uttarakhand%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1030', 'Swami Vivekananda Nishakt / Widow Pension', 'pension', 'Monthly Pension', 'Jharkhand', 'Age 18+, Jharkhand resident, BPL status or destitute', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Jharkhand.', ARRAY['Aadhaar', 'Death Certificate', 'BPL Card', 'Bank Account Details'], '₹1,000/month', 'https://www.myscheme.gov.in/search?q=Jharkhand%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1031', 'Sukhada Sahara Pension Scheme', 'pension', 'Monthly Pension', 'Chhattisgarh', 'Age 18-39 / 40-79 yrs, CG resident, BPL list verified', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Chhattisgarh.', ARRAY['Aadhaar', 'Death Certificate', 'BPL Card', 'Bank Details'], '₹350 - ₹500/month', 'https://www.myscheme.gov.in/search?q=Chhattisgarh%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1032', 'Dayanand Social Security Scheme (DSSS - Widow)', 'pension', 'Monthly Pension', 'Goa', 'Goa resident for 15+ years, annual income < ₹1,50,000', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Goa.', ARRAY['15-Yr Domicile', 'Death Certificate', 'Income Cert', 'Aadhaar'], '₹2,000/month', 'https://www.myscheme.gov.in/search?q=Goa%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1033', 'Integrated Social Security Scheme (ISSS - Widow)', 'pension', 'Monthly Pension', 'Jammu & Kashmir', 'Age 18+, J&K resident, destitute / BPL category', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Jammu & Kashmir.', ARRAY['Aadhaar', 'Death Certificate', 'Income & Category Proof'], '₹1,000/month', 'https://www.myscheme.gov.in/search?q=Jammu%20&%20Kashmir%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1034', 'ISSS Financial Assistance to Widows', 'pension', 'Monthly Pension', 'Ladakh', 'Resident of UT Ladakh, destitute / BPL status', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Ladakh.', ARRAY['Aadhaar', 'Death Certificate', 'Resident Certificate', 'Bank Account'], '₹1,000/month', 'https://www.myscheme.gov.in/search?q=Ladakh%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1035', 'State Widow Pension Scheme', 'pension', 'Monthly Pension', 'Tripura', 'Age 18+, Tripura resident, BPL household', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Tripura.', ARRAY['Aadhaar', 'Death Certificate', 'Ration Card', 'Bank Passbook'], '₹2,000/month', 'https://www.myscheme.gov.in/search?q=Tripura%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1036', 'Manipur State Widow Pension Scheme', 'pension', 'Monthly Pension', 'Manipur', 'Age 40+, Manipur resident, BPL / low income family', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Manipur.', ARRAY['Aadhaar', 'Death Certificate', 'Income Certificate', 'Bank Details'], '₹500/month', 'https://www.myscheme.gov.in/search?q=Manipur%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1037', 'National Social Assistance - Widow Pension', 'pension', 'Monthly Pension', 'Meghalaya', 'Age 40-79 yrs, Meghalaya resident, BPL list entry', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Meghalaya.', ARRAY['Aadhaar', 'Death Certificate', 'EPIC Card', 'BPL Certificate'], '₹500/month', 'https://www.myscheme.gov.in/search?q=Meghalaya%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1038', 'Indira Gandhi Widow Pension Scheme', 'pension', 'Monthly Pension', 'Mizoram', 'Widow, family below poverty line (BPL), not remarried, not receiving another govt pension', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Mizoram. Rs 300/month from Centre (states top up). Base national scheme under NSAP; most states add a top-up on this. Age range: 40-79 (auto-shifts to Old Age Pension at 80). Income limit: BPL household. Verify amount on nsap.nic.in before demo.', ARRAY['Aadhaar', 'Death Certificate', 'BPL Verification', 'Bank Passbook'], '₹300 - ₹500/month', 'https://www.myscheme.gov.in/search?q=Mizoram%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'Online', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1039', 'State NSAP Widow Pension', 'pension', 'Monthly Pension', 'Nagaland', 'Age 40-79 yrs, Nagaland indigenous inhabitant, BPL', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Nagaland.', ARRAY['Indigenous Certificate', 'Death Cert', 'BPL Card', 'Bank Account'], '₹300 - ₹500/month', 'https://www.myscheme.gov.in/search?q=Nagaland%20widow', 'https://nsap.nic.in/', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1040', 'Sikkim Destitute Widow Pension Scheme', 'pension', 'Monthly Pension', 'Sikkim', 'Age 18+, Sikkim resident, Certificate of Identification (COI)', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Sikkim.', ARRAY['COI', 'Aadhaar', 'Death Certificate', 'Income Certificate'], '₹1,000/month', 'https://www.myscheme.gov.in/search?q=Sikkim%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1041', 'Arunachal Social Security Widow Pension', 'pension', 'Monthly Pension', 'Arunachal Pradesh', 'Age 40-79 yrs, APST resident, BPL category', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Arunachal Pradesh.', ARRAY['APST Certificate', 'Death Certificate', 'BPL Card', 'Bank Passbook'], '₹500/month', 'https://www.myscheme.gov.in/search?q=Arunachal%20Pradesh%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1042', 'Financial Assistance to Widows and Destitute Women', 'pension', 'Monthly Pension', 'Chandigarh', 'Age 18+, UT Chandigarh resident for 3+ years, income < ₹1.5L/yr', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Chandigarh.', ARRAY['Aadhaar', 'Death Certificate', 'Residence Proof', 'Bank Details'], '₹1,000/month', 'https://www.myscheme.gov.in/search?q=Chandigarh%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1043', 'Widow Pension Scheme (Social Welfare)', 'pension', 'Monthly Pension', 'Puducherry', 'Puducherry resident for 5+ years, annual income < ₹75,000', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Puducherry.', ARRAY['Aadhaar', 'Death Certificate', 'Domicile', 'Income Proof'], '₹2,000 - ₹3,000/month (by age criteria)', 'https://www.myscheme.gov.in/search?q=Puducherry%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1044', 'Financial Assistance to Destitute Widows', 'pension', 'Monthly Pension', 'Andaman and Nicobar', 'Resident of A&N Islands for 2+ years, destitute status', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Andaman and Nicobar.', ARRAY['Aadhaar', 'Death Certificate', 'Local Island Residence Proof'], '₹2,500/month', 'https://www.myscheme.gov.in/search?q=Andaman%20and%20Nicobar%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1045', 'Social Assistance Widow Pension Scheme', 'pension', 'Monthly Pension', 'Dadra & Nagar Haveli & Daman & Diu', 'Resident of UT for 5+ years, family income < ₹1,00,000', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Dadra & Nagar Haveli & Daman & Diu.', ARRAY['Aadhaar', 'Death Certificate', 'Domicile', 'Income Certificate'], '₹1,500/month', 'https://www.myscheme.gov.in/search?q=Dadra%20&%20Nagar%20Haveli%20&%20Daman%20&%20Diu%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1046', 'Destitute Widow Welfare Pension', 'pension', 'Monthly Pension', 'Lakshadweep', 'Native resident of Lakshadweep Islands, BPL category', 'Direct monthly financial pension assistance disbursed to verified eligible widows across Lakshadweep.', ARRAY['Aadhaar', 'Death Certificate', 'Island Native ID', 'Bank Details'], '₹1,000/month', 'https://www.myscheme.gov.in/search?q=Lakshadweep%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1047', 'Vidhwa Punarvivah Protsahan Yojana', 'family', 'Remarriage Grant', 'Uttar Pradesh', 'Widow remarrying a legally eligible male; not income tax payee', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Uttar Pradesh.', ARRAY['Marriage Certificate', 'Husband''s Death Certificate', 'Aadhaar', 'Joint Account'], '₹51,000 one-time financial incentive', 'https://www.myscheme.gov.in/search?q=Uttar%20Pradesh%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1048', 'Mukhyamantri Kalyani Vivah Sahayata Yojana', 'family', 'Remarriage Grant', 'Madhya Pradesh', 'Widow (Kalyani) residing in MP remarrying; age 18+', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Madhya Pradesh.', ARRAY['Marriage Certificate', 'Death Certificate of former spouse', 'Samagra ID'], '₹2,00,000 one-time incentive directly credited to bride''s account', 'https://www.myscheme.gov.in/search?q=Madhya%20Pradesh%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1049', 'Mukhyamantri Vidhwa Punarvivah Uphaar Yojana', 'family', 'Remarriage Grant', 'Rajasthan', 'Widow remarrying, Rajasthan resident, registered marriage', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Rajasthan.', ARRAY['Marriage Certificate', 'Death Certificate', 'Jan Aadhaar', 'Bank Details'], '₹51,000 gift grant deposited in bride''s bank account', 'https://www.myscheme.gov.in/search?q=Rajasthan%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1050', 'Widow Remarriage Incentive Scheme', 'family', 'Remarriage Grant', 'Himachal Pradesh', 'Widow resident of HP; remarriage scheme for bona fide Himachali couples remarrying', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Himachal Pradesh. Pension: check WCD HP portal; Remarriage grant: Rs 2,00,000 (recently enhanced). HP has a distinct remarriage support grant, not common in most states. Age range: As per state notification. Income limit: Income-based for pension. Verify pension amount separately from remarriage grant.', ARRAY['Marriage Registration', 'Death Certificate of 1st husband', 'Bonafide HP'], '₹65,000 one-time financial assistance', 'https://www.myscheme.gov.in/search?q=Himachal%20Pradesh%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'Offline via WCD Department', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1051', 'Widow Remarriage Encouragement Assistance', 'family', 'Remarriage Grant', 'Maharashtra', 'Resident of Maharashtra, valid legal remarriage after widowhood', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Maharashtra.', ARRAY['Marriage Certificate', 'Death Certificate', 'Domicile', 'Aadhaar'], '₹50,000 fixed deposit / assistance for newly wed couple', 'https://www.myscheme.gov.in/search?q=Maharashtra%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1052', 'Ganga Swarupa Punarvivah Arthik Sahay Yojana', 'family', 'Remarriage Grant', 'Gujarat', 'Widow remarrying, Gujarat resident, age 18-40 years', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Gujarat.', ARRAY['Remarriage Registration', 'Husband''s Death Certificate', 'Aadhaar'], '₹50,000 (₹25k NSC + ₹25k Bank DBT)', 'https://www.myscheme.gov.in/search?q=Gujarat%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1053', 'Mangalya Scheme (Financial Assistance for Widow Remarriage)', 'family', 'Remarriage Grant', 'Kerala', 'Widow/divorced woman legally remarrying; annual family income < ₹1 Lakh', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Kerala.', ARRAY['Marriage Certificate', 'Income Certificate', 'Death Certificate', 'Bank Passbook'], '₹25,000 one-time grant', 'https://www.myscheme.gov.in/search?q=Kerala%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1054', 'Incentive for Widow Remarriage', 'family', 'Remarriage Grant', 'Karnataka', 'Resident of Karnataka, age 18+, legally solemnized first remarriage', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Karnataka.', ARRAY['Marriage Certificate', 'Death Certificate of ex-spouse', 'Ration Card'], '₹3,00,000 grant for groom marrying a widow', 'https://www.myscheme.gov.in/search?q=Karnataka%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1055', 'Kanyadan / Mukhya Mantri Vivah Shagun Yojana (Widow''s Daughter)', 'family', 'Marriage Grant', 'Haryana', 'Widow residing in Haryana, family annual income < ₹1,80,000', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Haryana.', ARRAY['Wedding Card', 'Parivar Pehchan Patra', 'Death Certificate', 'Aadhaar'], '₹71,000 grant for marriage of widow''s daughter', 'https://www.myscheme.gov.in/search?q=Haryana%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1056', 'Moovalur Ramamirtham Ammaiyar Marriage Scheme (Widow Daughter)', 'family', 'Marriage Grant', 'Tamil Nadu', 'Annual income < ₹72,000, girl age 18+, Degree/Diploma holder', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Tamil Nadu.', ARRAY['Community Certificate', 'Income Certificate', 'Death Certificate', 'Degree Marksheet'], '₹50,000 + 8g Gold Coin for graduate daughters of widows', 'https://www.myscheme.gov.in/search?q=Tamil%20Nadu%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1057', 'Financial Assistance for Marriage of Daughters of Widows', 'family', 'Marriage Grant', 'Delhi', 'Widow residing in Delhi for 5+ years, annual income < ₹1,00,000', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Delhi.', ARRAY['Age proof of daughter', 'Death Certificate', 'Delhi Voter ID/Aadhaar'], '₹30,000 per daughter (up to 2 daughters)', 'https://www.myscheme.gov.in/search?q=Delhi%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1058', 'Ashirwad Scheme (Shagun for Widow''s Daughter Marriage)', 'family', 'Marriage Grant', 'Punjab', 'BPL/Low-income widow with daughter aged 18+; Punjab resident', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Punjab.', ARRAY['Income Certificate', 'Death Certificate', 'Wedding Invitation', 'Aadhaar'], '₹51,000 one-time shagun grant before/at wedding', 'https://www.myscheme.gov.in/search?q=Punjab%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1059', 'Rupashree Prakalpa (Priority for Daughters of Widows)', 'family', 'Marriage Grant', 'West Bengal', 'Daughter aged 18+, family annual income < ₹1.5 Lakhs, WB resident', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in West Bengal.', ARRAY['Marriage Notice / Card', 'Death Certificate', 'Aadhaar', 'Bank Details'], '₹25,000 one-time cash assistance before marriage', 'https://www.myscheme.gov.in/search?q=West%20Bengal%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1060', 'Mukhyamantri Kanya Ratna / Marriage Aid for Widow''s Children', 'childcare', 'Marriage Grant', 'Odisha', 'Destitute widow residing in Odisha, daughter aged 18+', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Odisha.', ARRAY['Death Certificate', 'Income Certificate', 'Marriage Registration', 'Bank Info'], '₹50,000 grant for marriage expenses', 'https://www.myscheme.gov.in/search?q=Odisha%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 0, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1061', 'Arundhati Gold Scheme (Applicable to Widow''s Daughters)', 'family', 'Marriage Grant', 'Assam', 'Registered marriage under Special Marriage Act, annual income < ₹5 Lakhs', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Assam.', ARRAY['Special Marriage Registration', 'Death Certificate of father', 'Aadhaar'], '₹40,000 financial assistance for purchasing 1 Tola gold', 'https://www.myscheme.gov.in/search?q=Assam%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1062', 'Kanya Vivah Yojana (Priority for Widowed Mothers)', 'family', 'Marriage Grant', 'Bihar', 'BPL registered widowed mother, daughter aged 18+', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Bihar.', ARRAY['BPL Card', 'Death Certificate', 'Marriage Registration', 'Aadhaar'], '₹10,000 - ₹20,000 DBT transfer', 'https://www.myscheme.gov.in/search?q=Bihar%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1063', 'Mukhya Mantri Kanyadan Yojana', 'family', 'Marriage Grant', 'Jharkhand', 'Widow/destitute mother in BPL category, daughter aged 18+', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Jharkhand.', ARRAY['BPL Proof', 'Death Certificate', 'Age Proof', 'Bank Passbook'], '₹30,000 grant for daughter''s wedding', 'https://www.myscheme.gov.in/search?q=Jharkhand%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1064', 'Gaura Devi Kanyadhan / Widow''s Daughter Marriage Aid', 'family', 'Marriage Grant', 'Uttarakhand', 'Widow belonging to SC/ST/EWS categories, resident of Uttarakhand', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Uttarakhand.', ARRAY['Death Certificate', 'EWS/Caste Certificate', 'Marriage Proof', 'Aadhaar'], '₹50,000 grant upon marriage', 'https://www.myscheme.gov.in/search?q=Uttarakhand%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1065', 'YSR Kalyanamasthu (Special Support for Widowed Mothers)', 'family', 'Marriage Grant', 'Andhra Pradesh', 'Daughter aged 18+, groom aged 21+, White ration card holder', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Andhra Pradesh.', ARRAY['Rice Card', '10th Marksheet', 'Death Certificate', 'Marriage Card'], '₹1,00,000 for SC/ST, ₹50,000 for BC/OC marriages', 'https://www.myscheme.gov.in/search?q=Andhra%20Pradesh%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1066', 'Kalyana Lakshmi / Shaadi Mubarak (Widow Parent Priority)', 'family', 'Marriage Grant', 'Telangana', 'Unmarried girl aged 18+, mother is widow/destitute, income < ₹2L/yr', 'Targeted welfare grant providing financial security during remarriage or marriage of daughters in Telangana.', ARRAY['Aadhaar', 'Death Certificate', 'Income Certificate', 'Bank Details'], '₹1,00,116 one-time financial aid', 'https://www.myscheme.gov.in/search?q=Telangana%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1067', 'UP Mahila Samarthya Yojana (Self-Help for Widows)', 'employment', 'Livelihood / SHG', 'Uttar Pradesh', 'Women SHGs, destitute widows and rural women entrepreneurs', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Uttar Pradesh.', ARRAY['Aadhaar', 'SHG Registration', 'Domicile', 'Bank Account'], 'Skill training, cluster development funds & market setup', 'https://www.myscheme.gov.in/search?q=Uttar%20Pradesh%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1068', 'Tejaswini Rural Women Empowerment Programme', 'employment', 'Micro-enterprise Loan', 'Maharashtra', 'Rural destitute women and widows in self-help collectives', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Maharashtra.', ARRAY['7/12 extract or BPL card', 'Death Certificate', 'Aadhaar', 'Bank Details'], 'Zero/subsidized interest micro-loans up to ₹2 Lakhs', 'https://www.myscheme.gov.in/search?q=Maharashtra%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1069', 'Indira Mahila Shakti Udyam Protsahan Yojana', 'employment', 'Business Loan Subsidy', 'Rajasthan', 'Women entrepreneurs, priority given to single/widowed women', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Rajasthan.', ARRAY['Jan Aadhaar', 'Project Report', 'Death Certificate', 'Domicile'], 'Loan up to ₹1 Crore for SHGs / ₹50L for individuals with 25-30% subsidy', 'https://www.myscheme.gov.in/search?q=Rajasthan%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1070', 'Delhi SC/ST/OBC/Widows Minorities Financial & Development Corp (DSFDC) Loan', 'employment', 'Subsidized Loan', 'Delhi', 'Widows and vulnerable women residing in Delhi for 5+ years', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Delhi.', ARRAY['Death Certificate', 'Residence Proof', 'Project Proposal', 'Aadhaar'], 'Concessional loans up to ₹5 Lakhs at 4-6% interest', 'https://www.myscheme.gov.in/search?q=Delhi%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1071', 'Free Sewing Machine Scheme (Sathiyavani Muthu Ammaiyar)', 'employment', 'Skill & Equipment', 'Tamil Nadu', 'Destitute widows, deserted wives aged 20-40, income < ₹72,000/yr', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Tamil Nadu.', ARRAY['Destitute Widow Certificate', 'Tailoring Training Certificate', 'Aadhaar'], 'Free high-speed sewing machine with motor attachment', 'https://www.myscheme.gov.in/search?q=Tamil%20Nadu%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1072', 'Manav Garima Yojana (Equipment Kits for Widows)', 'employment', 'Livelihood Kit', 'Gujarat', 'Annual income < ₹1.2L (rural) / ₹1.5L (urban), age 18-60', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Gujarat.', ARRAY['Income Certificate', 'Caste/Category Certificate', 'Aadhaar'], 'Free toolkits for tailoring, beauty parlour, spice making worth ₹25,000', 'https://www.myscheme.gov.in/search?q=Gujarat%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1073', 'Mukhyamantri Nari Samman Yojana', 'pension', 'Direct Financial Aid', 'Madhya Pradesh', 'All eligible adult women and widows of MP, non-income-tax payers', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Madhya Pradesh.', ARRAY['Samagra ID', 'Aadhaar', 'Bank DBT enabled account'], '₹1,500/month direct cash assistance for livelihood sustenance', 'https://www.myscheme.gov.in/search?q=Madhya%20Pradesh%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1074', 'Haryana Women Development Corporation (HWDC) Education Loan Subsidy', 'education', 'Education Loan Subsidy', 'Haryana', 'Widows residing in Haryana with wards pursuing professional degrees', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Haryana.', ARRAY['PPP ID', 'Admission Letter', 'Bank Loan Sanction Letter', 'Death Cert'], '5% interest subsidy on higher education loans for children of widows', 'https://www.myscheme.gov.in/search?q=Haryana%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1075', 'Mai Bhago Istri Shakti Scheme', 'employment', 'Micro-Credit', 'Punjab', 'Rural women and widows engaged in agricultural allied activities', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Punjab.', ARRAY['Aadhaar', 'Primary Agriculture Credit Society (PACS) membership'], 'Subsidized working capital loans up to ₹50,000 for rural women', 'https://www.myscheme.gov.in/search?q=Punjab%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1076', 'Chetana Scheme for Rehabilitation of Destitute Women', 'employment', 'Rehabilitation & Loan', 'Karnataka', 'Widows, devadasis, and abandoned women aged 18-45 years', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Karnataka.', ARRAY['Income Certificate', 'Death Certificate', 'Aadhaar', 'Bank Details'], '₹50,000 financial package (₹25,000 subsidy + ₹25,000 bank loan)', 'https://www.myscheme.gov.in/search?q=Karnataka%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1077', 'Saranya Scheme (Self-Employment Scheme for Destitute Women)', 'employment', 'Self-Employment Loan', 'Kerala', 'Registered unemployed widows, divorced, and deserted women', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Kerala.', ARRAY['Employment Exchange Reg', 'Death Certificate', 'Income Certificate'], 'Interest-free loan up to ₹50,000 with 50% capital subsidy (max ₹25,000)', 'https://www.myscheme.gov.in/search?q=Kerala%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1078', 'YSR Cheyutha (Financial Support for Single Women & Widows)', 'employment', 'Livelihood Grant', 'Andhra Pradesh', 'Widows and women aged 45-60 years belonging to SC/ST/BC/Minorities', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Andhra Pradesh.', ARRAY['Aadhaar', 'Caste Certificate', 'Death Certificate', 'Rice Card'], '₹18,750 per year for 4 years (Total ₹75,000) for enterprise creation', 'https://www.myscheme.gov.in/search?q=Andhra%20Pradesh%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1079', 'Stree Nidhi Credit Cooperative Federation Loan', 'employment', 'Micro-credit Loan', 'Telangana', 'SHG member widows for dairy, grocery shop, tailoring businesses', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Telangana.', ARRAY['SHG ID', 'Aadhaar', 'Bank Passbook'], 'Affordable collateral-free credit up to ₹1,000,000 for micro-units', 'https://www.myscheme.gov.in/search?q=Telangana%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1080', 'Swami Vivekananda Merit-cum-Means Scholarship for Wards of Widows', 'education', 'Scholarship', 'West Bengal', 'Family income < ₹2.5 Lakhs, 60%+ marks in qualifying exam', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in West Bengal.', ARRAY['Income Certificate', 'Death Certificate of Father', 'Marksheets'], '₹12,000 - ₹60,000/year for higher secondary to PG studies', 'https://www.myscheme.gov.in/search?q=West%20Bengal%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1081', 'Biju Shishu Suraksha Yojana (Support for Orphaned Children of Widows)', 'childcare', 'Child Welfare Aid', 'Odisha', 'Children of deceased single mothers/widows with no breadwinner', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Odisha.', ARRAY['Death Certificate', 'Child School Bonafide', 'Guardian Bank Details'], 'Scholarships for higher education and ₹20,000 girl marriage assistance', 'https://www.myscheme.gov.in/search?q=Odisha%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 0, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1082', 'Swanirbhar Naari Scheme (Direct Procurement from Weavers/Widows)', 'employment', 'Market Linkage', 'Assam', 'Registered female weavers, prioritize indigenous widows and SHGs', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Assam.', ARRAY['Weaver ID Card', 'Aadhaar', 'Bank Details', 'Handloom Registration'], 'Direct MSP procurement of handloom items bypassing middlemen', 'https://www.myscheme.gov.in/search?q=Assam%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1083', 'Mukhyamantri Mahila Udyami Yojana', 'employment', 'Entrepreneurship Grant', 'Bihar', 'Women entrepreneurs including widows with 10+2/ITI/Diploma', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Bihar.', ARRAY['Educational Marksheet', 'Project Proposal', 'Aadhaar', 'Cancelled Cheque'], '₹10 Lakhs project funding (50% Grant + 50% Interest-free Loan)', 'https://www.myscheme.gov.in/search?q=Bihar%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1084', 'Mother Teresa Asahay Matri Sambal Yojana', 'childcare', 'Child Care Allowance', 'Himachal Pradesh', 'Widows and destitute mothers with family income < ₹35,000/yr', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Himachal Pradesh.', ARRAY['Income Certificate', 'Death Certificate', 'Children Birth Certificates'], '₹6,000 per child/year (up to 2 children) till age 18', 'https://www.myscheme.gov.in/search?q=Himachal%20Pradesh%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 0, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1085', 'Chief Minister Harela Skill Scheme for Widows', 'employment', 'Skill Development', 'Uttarakhand', 'Widows aged 18-45 years seeking employment in hospitality/IT/crafts', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Uttarakhand.', ARRAY['Aadhaar', 'Death Certificate', 'Domicile', 'Qualification Proof'], 'Free residential technical training + ₹1,000/mo stipend', 'https://www.myscheme.gov.in/search?q=Uttarakhand%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1086', 'Tejaswini Project (Adolescent Girls & Young Widows Empowerment)', 'employment', 'Skill & Livelihood', 'Jharkhand', 'Young widows and vulnerable girls aged 14-24 in selected districts', 'Empowerment, education and enterprise support mechanism tailored for widows and their families in Jharkhand.', ARRAY['Aadhaar', 'Death Certificate', 'Age Proof', 'School Transfer Cert'], 'Vocational skill certifications, bridge education and enterprise toolkits', 'https://www.myscheme.gov.in/search?q=Jharkhand%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1087', 'Ayushman Bharat - PM-JAY (Automatic Inclusion for Destitute/Widow Households)', 'health', 'Health Insurance', 'Central / All India', 'SECC 2011 Deprivation D1/D2/D3 households, BPL widows', 'Comprehensive secondary and tertiary cashless hospitalization coverage in all empaneled hospitals.', ARRAY['Ration Card', 'Aadhaar Card', 'PM-JAY letter'], '₹5,00,000 cashless health insurance cover per family per year', 'https://www.myscheme.gov.in/schemes/ab-pmjay', 'https://nha.gov.in/img/nha-logo.png', 2, 'See application portal', TRUE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1088', 'Antyodaya Anna Yojana (AAY - Priority for Widows without Support)', 'health', 'Food Security', 'Central / All India', 'Destitute widows and terminally ill heads of households lacking means of support', 'Guaranteed monthly food basket ensuring complete household nutritional security.', ARRAY['AAY Ration Card', 'Death Certificate', 'Aadhaar'], '35 kg food grains per month at highly subsidized rate (₹1-3/kg)', 'https://www.myscheme.gov.in/schemes/aay', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 0, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1089', 'Employees'' Provident Fund - EPS 95 Widow Pension', 'pension', 'Social Security / EPF', 'Central / All India', 'Widows of formal sector employees who contributed to EPS 95 scheme', 'Lifelong monthly statutory family pension under EPFO.', ARRAY['Form 10D', 'Death Certificate of member', 'Joint photo', 'Bank Details'], 'Minimum ₹1,000/month lifelong pension to widow + child pension up to 25 yrs', 'https://www.myscheme.gov.in/search?q=Central%20widow', 'https://www.epfindia.gov.in/site_en/images/logo.png', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1090', 'ESIC Dependent Benefit Scheme for Widows of Insured Workers', 'health', 'Health & Compensation', 'Central / All India', 'Widow of insured person dying due to employment injury or occupational disease', 'Lifetime compensation and free medical care in ESIC hospitals.', ARRAY['ESIC Form 16', 'Death Certificate', 'Post-mortem/Medical Report'], '90% of deceased worker''s average daily wages paid monthly for life', 'https://www.myscheme.gov.in/search?q=Central%20widow', 'https://www.esic.gov.in/', 2, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1091', 'Armed Forces Battle Casualties Welfare Fund (Ex-Gratia to War Widows)', 'pension', 'Ex-Gratia Grant', 'Central / All India', 'Next of Kin (Widow) of Armed Forces personnel killed in operations', 'Lump-sum national defense welfare grant honoring fallen defense personnel''s spouse.', ARRAY['Battle Casualty Certificate', 'Service Record', 'Bank Account'], '₹8 Lakhs ex-gratia financial grant in addition to family pension', 'https://www.myscheme.gov.in/search?q=Central%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1092', 'Central Soldier Board (KSB) - Financial Assistance for Non-Pensioner Widows', 'pension', 'Monthly Relief', 'Central / All India', 'Widows of non-pensioner ex-servicemen living in acute poverty', 'Monthly financial relief funded by Kendriya Sainik Board.', ARRAY['Discharge Book', 'Death Certificate', 'Income Certificate from DC'], '₹4,000/month grant for indigent non-pensioner ESM widows', 'https://www.myscheme.gov.in/search?q=Central%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1093', 'Ramai Awas Yojana (Priority for SC/Neo-Buddhist Widows)', 'housing', 'Housing Grant', 'Maharashtra', 'Widows belonging to SC/Neo-Buddhist categories, homeless in Maharashtra', 'State housing scheme giving first allotment priority to destitute widows.', ARRAY['Caste Certificate', 'Death Certificate', '7/12 land record', 'Aadhaar'], '₹1.3 Lakhs to ₹2.5 Lakhs grant for house construction', 'https://www.myscheme.gov.in/search?q=Maharashtra%20widow', 'https://pmayg.nic.in/netiay/images/logo.png', 5, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1094', 'Mukhyamantri Awas Yojana - Gramin (Widows of Calamity Victims)', 'housing', 'Housing Grant', 'Uttar Pradesh', 'Widows affected by natural disasters, leprosy, encephalitis, or homeless', 'Comprehensive rural shelter rehabilitation package.', ARRAY['Aadhaar', 'Death Certificate', 'Gram Sabha Resolution', 'Bank Details'], '₹1,20,000 grant + 90 days MGNREGA wages + toilet construction funds', 'https://www.myscheme.gov.in/search?q=Uttar%20Pradesh%20widow', 'https://pmayg.nic.in/netiay/images/logo.png', 5, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1095', 'Palhar Yojana (Financial Support for Foster/Widow Children)', 'childcare', 'Child Maintenance', 'Rajasthan', 'Widowed mother with children pursuing regular school education', 'Substantial monthly child welfare allowance to prevent school dropouts.', ARRAY['Jan Aadhaar', 'Death Certificate', 'School Bonafide Certificate'], '₹1,500/mo (age 0-6) and ₹2,500/mo (age 6-18) + ₹2,000 annual kit', 'https://www.myscheme.gov.in/search?q=Rajasthan%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 0, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1096', 'Free Bus Travel Scheme for Women (Zero-Fare Pass)', 'pension', 'Public Transport', 'Tamil Nadu', 'All women including widows and senior citizens residing in Tamil Nadu', 'Free urban and semi-urban transit mobility facilitating commute to workplaces.', ARRAY['No card needed / Standard ID proof'], '100% free daily bus travel on state-run ordinary town buses', 'https://www.myscheme.gov.in/search?q=Tamil%20Nadu%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1097', 'Delhi Financial Aid for Legal Support to Women', 'legal', 'Legal Aid Subsidy', 'Delhi', 'Widow / divorced / separated / destitute / abandoned women resident in Delhi', 'Financial reimbursement for litigation costs, documentation, and lawyer fees. Check current amount on WCD Delhi portal. Delhi allows applications from age 18, broader than many states. Age range: 18+. Income limit: Income-based, check current threshold on portal. Verify exact amount before demo.', ARRAY['Death certificate', 'Aadhaar', 'residence proof', 'income certificate'], '₹15,000 legal aid allowance for women in matrimonial/succession disputes', 'https://nalsa.gov.in/services/legal-aid', 'https://nalsa.gov.in/', 0, 'Online via Delhi e-District portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1098', 'Manaswini Scheme for Destitute and Separated Women', 'pension', 'Monthly Pension', 'Karnataka', 'Unmarried, separated or widowed women aged 40-64 without support', 'State social pension covering marginalized women outside standard widow pension norms.', ARRAY['Aadhaar', 'Age Proof', 'Village Accountant verification report'], '₹800/month monthly financial relief', 'https://www.myscheme.gov.in/search?q=Karnataka%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1099', 'Aswasakiranam Scheme (Assistance to Caregiver Widows)', 'pension', 'Caregiver Pension', 'Kerala', 'Widows caring for 100% disabled/bedridden family members', 'Special allowance compensating widows who cannot take jobs due to caregiving duties.', ARRAY['Medical Board Disability Certificate', 'Death Certificate of spouse', 'Aadhaar'], '₹600/month monthly allowance for caregivers of bedridden relatives', 'https://www.myscheme.gov.in/search?q=Kerala%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1100', 'Free Health Insurance under Sarbat Sehat Bima Yojana (Widows Coverage)', 'health', 'Health Insurance', 'Punjab', 'Widow pension beneficiaries and J-Form/Ration card holders in Punjab', 'State-backed cashless health coverage for hospitalization and surgeries.', ARRAY['Aadhaar', 'Widow Pension PPO Number / Smart Ration Card'], '₹5,00,000 cashless secondary/tertiary hospital care', 'https://www.myscheme.gov.in/search?q=Punjab%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 2, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1101', 'Maa Annapurna Yojana (Grain Subsidy for Widow Beneficiaries)', 'health', 'Food Subsidy', 'Gujarat', 'Widows registered under Ganga Swarupa Yojana', 'PDS entitlement securing food grains for single female headed families.', ARRAY['Ganga Swarupa Certificate', 'Ration Card', 'Aadhaar'], 'Free / ₹2/kg wheat and ₹3/kg rice allocation to NFSA priority cards', 'https://www.myscheme.gov.in/search?q=Gujarat%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 0, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1102', 'YSR Sunna Vaddi (Zero Interest Loans for Women SHGs)', 'employment', 'Interest Subvention', 'Andhra Pradesh', 'SHG member widows repaying credit on regular schedule', 'Complete interest waiver reducing debt burden on women entrepreneurs.', ARRAY['SHG Bank Passbook', 'Aadhaar', 'Vaddi Reimbursement Form'], '100% interest reimbursement on bank loans up to ₹3 Lakhs', 'https://www.myscheme.gov.in/search?q=Andhra%20Pradesh%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1103', 'Arogyasri Health Scheme (Free Hospitalization for BPL Widows)', 'health', 'Health Insurance', 'Telangana', 'BPL White Card holders including all Aasara widow pension recipients', 'Cashless medical management in government and private network hospitals.', ARRAY['Aasara Card', 'White Ration Card', 'Aadhaar'], '₹5,00,000 cashless hospital treatment for critical illnesses', 'https://www.myscheme.gov.in/search?q=Telangana%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 2, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1104', 'Haryana Matrushakti Udayamita Yojana', 'employment', 'Enterprise Loan Subsidy', 'Haryana', 'Women/widows with family annual income < ₹5,00,000 on PPP portal', 'Low cost credit facilitation for setting up shops, tailoring, or dairy ventures.', ARRAY['Parivar Pehchan Patra (PPP)', 'Project Proposal', 'Aadhaar'], 'Loans up to ₹3 Lakhs with 7% interest subvention for 3 years', 'https://www.myscheme.gov.in/search?q=Haryana%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 6, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1105', 'Sambal 2.0 Yojana (Special Death and Disability Assistance to Widows)', 'pension', 'Ex-Gratia Grant', 'Madhya Pradesh', 'Widow of unorganized registered worker under Sambal portal', 'High-value immediate statutory insurance payout for unorganized laborers'' families.', ARRAY['Sambal Card', 'Death Certificate', 'FIR/Post-mortem (if accidental)', 'Aadhaar'], '₹2,00,000 (normal death) / ₹4,00,000 (accidental death) of spouse', 'https://www.myscheme.gov.in/search?q=Madhya%20Pradesh%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1106', 'Noni Suraksha Yojana (Financial Security for Daughters of Widows)', 'childcare', 'Child Bond', 'Chhattisgarh', 'BPL registered widows with up to 2 daughters; resident of CG', 'Long-term financial assurance saving daughters from child marriage and illiteracy.', ARRAY['BPL Card', 'Death Certificate', 'Daughter Birth Certificate', 'School Proof'], '₹1,00,000 maturity bond payable on daughter reaching 18 years and passing 12th', 'https://www.myscheme.gov.in/search?q=Chhattisgarh%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 0, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1107', 'Teelu Rauteli Special Award & Social Pension for Widows', 'pension', 'Honorarium & Pension', 'Uttarakhand', 'Widows and women facing exceptional social distress in hill terrains', 'Targeted hill welfare initiative assisting vulnerable women in remote valleys.', ARRAY['Domicile Certificate', 'Death Certificate', 'DM Recommendation'], '₹1,000 - ₹5,000/mo special allowance for brave / destitute women', 'https://www.myscheme.gov.in/search?q=Uttarakhand%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1108', 'Beti Hai Anmol Yojana (Assistance for Widowed Mother''s Daughters)', 'childcare', 'Child Grant', 'Himachal Pradesh', 'BPL widows with newborn daughters up to 2 girls', 'Financial security promoting higher education for daughters of single mothers.', ARRAY['BPL Certificate', 'Death Certificate', 'Birth Certificate', 'Aadhaar'], '₹21,000 post office deposit at birth + ₹450-₹5,000 annual scholarship', 'https://www.myscheme.gov.in/search?q=Himachal%20Pradesh%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 0, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1109', 'Griha Aadhar Scheme for Housewives and Widows', 'pension', 'Monthly Sustenance', 'Goa', 'Goa resident for 15+ years, annual family income < ₹3,00,000', 'Monthly direct kitchen support fund shielding families from consumer price inflation.', ARRAY['15-Yr Domicile', 'Death Certificate (if widowed)', 'Income Certificate', 'Aadhaar'], '₹1,500/month financial aid to bridge family kitchen expenses', 'https://www.myscheme.gov.in/search?q=Goa%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 3, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1110', 'State Marriage Assistance Scheme (SMAS) for Poor Girls / Widows'' Wards', 'family', 'Marriage Grant', 'Jammu & Kashmir', 'Poor unmarried girls / daughters of destitute widows on AAY/BPL lists', 'Direct financial grant safeguarding underprivileged daughters'' marriage dignity.', ARRAY['Aadhaar', 'Death Certificate', 'AAY/PHH Ration Card', 'Bank Passbook'], '₹50,000 cash grant + cost of 5 grams gold', 'https://www.myscheme.gov.in/search?q=Jammu%20&%20Kashmir%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('SRV-1111', 'Nirman Kusuma (Financial Aid for ITI/Diploma of Construction Worker Widows'' Wards)', 'education', 'Technical Education Aid', 'Odisha', 'Children of registered construction workers / deceased workers', 'Full tuition and living stipend support for job-oriented technical education.', ARRAY['OB&OCWW Board Card', 'Death Certificate', 'ITI/Diploma Admission Proof'], '₹23,600 to ₹26,300/year for ITI and ₹40,000 for Diploma courses', 'https://www.myscheme.gov.in/search?q=Odisha%20widow', 'https://www.myscheme.gov.in/images/myscheme-logo.svg', 4, 'See application portal', FALSE, NULL, 0, 'active', 'widows.schemes.link.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('DB2-P01', 'Karnataka Widow Pension (state-funded, above central base)', 'pension', 'Pension', 'Karnataka', 'Widow, BPL or income-eligible household', 'State has expanded beneficiary criteria beyond central norms. Age range: 40-79 (central component); state has relaxed criteria in places. Income limit: Income-based. Verify current combined amount on state portal.', ARRAY['Death certificate', 'Aadhaar', 'income certificate'], 'State pays Rs 400-2000/month (varies by scheme component) above Centre''s Rs 200-500', 'https://sw.karnataka.gov.in', 'https://sw.karnataka.gov.in/favicon.ico', 3, 'Online/Offline via District Social Welfare Office', FALSE, NULL, 0, 'active', 'databse.2.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('DB2-P02', 'Rajasthan Widow Pension Scheme', 'pension', 'Pension', 'Rajasthan', 'Widow, income below state ceiling (income of adult sons may be excluded per NSAP norms)', 'Known documented case of rejection due to income cap edge cases - flag this UX risk in your app. Age range: 18-59 typically. Income limit: Roughly Rs 48,000/year cap (verify current figure - documented rejection cases near this threshold). Verify current income cap and amount.', ARRAY['Death certificate', 'Aadhaar', 'income certificate'], 'Check current amount on state portal', 'https://ssp.rajasthan.gov.in', 'https://ssp.rajasthan.gov.in/favicon.ico', 3, 'Online via SSO Rajasthan / Social Justice Dept', FALSE, NULL, 0, 'active', 'databse.2.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('DB2-P03', 'Punjab Old Age/Widow Pension Scheme', 'pension', 'Pension', 'Punjab', 'Widow, income-eligible', 'Not fully verified in this pass. Age range: To be verified. Income limit: Income-based. NEEDS VERIFICATION.', ARRAY['Death certificate', 'Aadhaar', 'income certificate'], 'To be verified on state portal', 'https://socialsecurity.punjab.gov.in', 'https://socialsecurity.punjab.gov.in/favicon.ico', 3, 'Online/Offline', FALSE, NULL, 0, 'active', 'databse.2.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('DB2-P04', 'Gujarat Widow Pension Yojana', 'pension', 'Pension', 'Gujarat', 'Widow, income-eligible', 'Not fully verified in this pass. Age range: To be verified. Income limit: Income-based. NEEDS VERIFICATION.', ARRAY['Death certificate', 'Aadhaar', 'income certificate'], 'To be verified on state portal', 'https://digitalgujarat.gov.in', 'https://digitalgujarat.gov.in/favicon.ico', 3, 'Online via Digital Gujarat portal', FALSE, NULL, 0, 'active', 'databse.2.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('DB2-P05', 'MP Vidhwa/Nirashrit Pension Yojana', 'pension', 'Pension', 'Madhya Pradesh', 'Widow, income-eligible', 'Not fully verified in this pass. Age range: To be verified. Income limit: Income-based. NEEDS VERIFICATION.', ARRAY['Death certificate', 'Aadhaar', 'income certificate'], 'To be verified on state portal', 'https://socialjustice.mp.gov.in', 'https://socialjustice.mp.gov.in/favicon.ico', 3, 'Online via MP e-District / Samagra portal', FALSE, NULL, 0, 'active', 'databse.2.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('DB2-P06', 'Bihar Vidhwa Pension Yojana', 'pension', 'Pension', 'Bihar', 'Widow, income-eligible', 'Not fully verified in this pass. Age range: 18-59 (state), 40-79 (central). Income limit: Income-based. NEEDS VERIFICATION.', ARRAY['Death certificate', 'Aadhaar', 'income certificate'], 'To be verified on state portal', 'https://sspmis.bihar.gov.in', 'https://sspmis.bihar.gov.in/favicon.ico', 3, 'Online via RTPS Bihar / SSPMIS', FALSE, NULL, 0, 'active', 'databse.2.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('DB2-P07', '', 'pension', 'Pension', 'andhra pradesh', '', '', '{}', '', NULL, NULL, 3, 'See application portal', FALSE, NULL, 0, 'active', 'databse.2.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('DB2-L01', 'National Legal Services Authority (NALSA)', 'legal', 'Free Legal Aid', 'Central / All India', 'Women and widows; NALSA / SLSA eligible categories', 'Provides free legal aid to women, SC/ST, disabled, and other eligible categories nationwide; toll-free helpline 15100.', ARRAY['Aadhaar / ID proof', 'Case application'], 'Free legal aid', 'https://nalsa.gov.in', 'https://nalsa.gov.in/', 0, 'nalsa.gov.in', TRUE, NULL, 0, 'active', 'databse.2.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('DB2-L02', 'State Legal Services Authority (SLSA)', 'legal', 'Free Legal Aid', 'Every State/UT', 'Women and widows; NALSA / SLSA eligible categories', 'Each state has its own SLSA under NALSA; District Legal Services Authorities (DLSA) operate at district level - widows are eligible for free legal aid as a matter of right in most cases.', ARRAY['Aadhaar / ID proof', 'Case application'], 'Free legal aid', NULL, 'https://nalsa.gov.in/', 0, 'Search ''[state] state legal services authority official site''', FALSE, NULL, 0, 'active', 'databse.2.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('DB2-PR01', 'Hindu Succession Act, 1956 (amended 2005) — Hindus, Buddhists, Jains, Sikhs', 'legal', 'Property Rights', 'India / personal law', 'Hindus, Buddhists, Jains, Sikhs', 'Widow is a Class I legal heir - equal share with children in husband''s property. 2005 amendment also gave daughters equal coparcenary rights; widow''s share is independent of this.', ARRAY['Marriage certificate', 'Death certificate', 'Property documents', 'ID proof'], 'Widow is a Class I legal heir - equal share with children in husband''s property', NULL, 'https://nalsa.gov.in/', 0, 'Legal process (varies)', FALSE, NULL, 0, 'active', 'databse.2.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('DB2-PR02', 'Muslim Personal Law (Shariat) Application Act, 1937 — Muslims', 'legal', 'Property Rights', 'India / personal law', 'Muslims', 'Widow gets a fixed fractional share (1/8th if there are children, 1/4th if none) under Islamic inheritance rules. Shares are fixed by religious law, not equal division - differs significantly from Hindu law.', ARRAY['Marriage certificate', 'Death certificate', 'Property documents', 'ID proof'], 'Widow gets a fixed fractional share (1/8th if there are children, 1/4th if none) under Islamic inheritance rules', NULL, 'https://nalsa.gov.in/', 0, 'Legal process (varies)', FALSE, NULL, 0, 'active', 'databse.2.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('DB2-PR03', 'Indian Succession Act, 1925 — Christians', 'legal', 'Property Rights', 'India / personal law', 'Christians', 'Widow gets 1/3rd of property if children survive, 1/2 if no lineal descendants but other kin survive. Applies to Christians; Parsis have a separate schedule under the same Act.', ARRAY['Marriage certificate', 'Death certificate', 'Property documents', 'ID proof'], 'Widow gets 1/3rd of property if children survive, 1/2 if no lineal descendants but other kin survive', NULL, 'https://nalsa.gov.in/', 0, 'Legal process (varies)', FALSE, NULL, 0, 'active', 'databse.2.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;

INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES ('DB2-PR04', 'Indian Succession Act, 1925 (if married under Special Marriage Act) — All communities (special marriage)', 'legal', 'Property Rights', 'India / personal law', 'All communities (special marriage)', 'Governed by Indian Succession Act regardless of religion. Applies when marriage was registered under the Special Marriage Act, 1954.', ARRAY['Marriage certificate', 'Death certificate', 'Property documents', 'ID proof'], 'Governed by Indian Succession Act regardless of religion', NULL, 'https://nalsa.gov.in/', 0, 'Legal process (varies)', FALSE, NULL, 0, 'active', 'databse.2.xlsx')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;
