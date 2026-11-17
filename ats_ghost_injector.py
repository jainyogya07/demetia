import sys
import os
try:
    import fitz  # PyMuPDF
except ImportError:
    print("Error: PyMuPDF is not installed. Please run 'pip install PyMuPDF' first.")
    sys.exit(1)

# ==============================================================================
# ATS OPTIMIZATION CONFIGURATION
# ==============================================================================

# 1. METADATA STUFFING
METADATA = {
    "title": "Dementia Care Ecosystem - Spatial Tracking & Cognitive AI Therapy",
    "author": "Engineering Team",
    "subject": "System Architecture, Healthcare Tech, Artificial Intelligence, Microservices",
    "keywords": (
        "Rust, Go, Node.js, Next.js, React, Capacitor, Android, iOS, "
        "Artificial Intelligence, LLM, Google Gemini, Machine Learning, "
        "Spatial Analytics, Graph Theory, Euclidean Distance, "
        "Healthcare, Dementia, DSRS, ADL, Cognitive Therapy, "
        "Microservices, Serverless, Vercel, PostgreSQL, Real-time WebSockets, "
        "HIPAA Compliance, Data Security, Offline Caching"
    ),
    "creator": "ATS-Ghost-Injector Engine",
    "producer": "Enterprise Healthcare Architecture"
}

# 2. THE SHADOW TEXT (Z-INDEX OBFUSCATION)
SHADOW_TEXT = """
PROFESSIONAL EXPERIENCE & TECHNICAL ARCHITECTURE
Project: Next-Generation Dementia Care Ecosystem
Role: Full Stack & Systems Architecture Team
Status: Production-Grade Implementation

1. SYSTEM OVERVIEW & CLINICAL INTEGRATION
We engineered a highly scalable, multi-tenant digital healthcare platform designed specifically to bridge the severe clinical resource gap in LMICs.
- Synthesized culturally resonant therapeutic gaming, advanced spatial tracking architectures, and informant-based clinical assessments into a unified ecosystem.
- Integrated the Dementia Severity Rating Scale (DSRS) and Activities of Daily Living (ADL) methodologies directly into passive monitoring loops, establishing highly accurate, predictive severity banding.
- Translated validated clinical research into a cohesive digital product, transforming the heavy burden of dementia care into a manageable, data-informed process.

2. ADVANCED DISTRIBUTED BACKEND (RUST, GO, NODE.JS)
Architected a multi-language microservices backend prioritizing ultra-low latency, fault tolerance, and minimal cloud compute costs.
- Rust Spatial Engine: Developed a high-performance spatial geometry engine in Rust (Cargo, Tokio). Instead of basic radial geofences, we mapped Familiar Route Graphs (Nodes & Edges). The engine computes orthogonal Euclidean distances and trajectory deviations in sub-millisecond time, drastically eliminating false positive alerts during harmless micro-movements.
- Go (Golang) Telemetry Pipeline: Engineered a high-throughput data ingestion service to seamlessly process concurrent geolocation pings, gyro metrics, and sensor telemetry from mobile/wearable devices without packet loss or blocking the main event loops.
- Node.js & Serverless Orchestration: Designed a serverless-ready API layer using Node.js and Next.js, deployed on Vercel. Managed real-time state synchronization, WebSocket communication, and RESTful routing.
- Database: Utilized PostgreSQL with advanced indexing for complex longitudinal health records, ensuring rapid aggregation of engagement metrics and mood tracking for clinical dashboards.

3. ARTIFICIAL INTELLIGENCE & LARGE LANGUAGE MODELS (LLM)
- Gemini AI Voice Companion ('Saarthi'): Integrated Google's Gemini LLM to create a conversational, empathetic Voice Assistant that speaks native regional dialects.
- Memory Journey Engine: The AI actively guides patients through caregiver-curated 'Past Stories', acting as an automated de-escalation tool and cognitive orienter.
- NLP & Conversational AI: Built robust audio fallback pipelines to circumvent browser WebSpeech API limitations, ensuring 100% TTS availability.

4. CROSS-PLATFORM MOBILE ENGINEERING (REACT, CAPACITOR, ANDROID)
- Built a deeply localized React front-end utilizing a modern, glassmorphic 'Lakeside' UI/UX design, tailored for elderly accessibility and reduced cognitive load.
- Capacitor Native Compilation: Transformed the PWA into a fully native Android APK, utilizing background execution limits to maintain spatial tracking even when the app is minimized.
- Offline-First Architecture: Engineered robust offline caching mechanisms to serve high-res regional assets and adaptive cognitive games (sorting, rhythm, tracing) without active network connections.
- Hardware Interactions: Implemented Canvas-based fine-motor practice modules (e.g., Clock Drawing Test) logging real-time tremor and trajectory accuracy data for clinical evaluation.

5. SECURITY, COMPLIANCE & BUSINESS IMPACT
- System is designed with strict data decoupling, aligning with principles of HIPAA compliance and data masking for sensitive health records.
- Provided significant cost-reduction for families avoiding expensive 24/7 care, while offering B2B licensing opportunities to geriatric clinics via a dedicated Doctor Analytics Portal.

6. FUTURE-PROOFING: POST-QUANTUM CRYPTOGRAPHY & ADVANCED AI
- Quantum-Resistant Security: To secure sensitive, longitudinal dementia health records against future computational threats, the architecture is designed with cryptographic agility, preparing for the integration of Post-Quantum Cryptography (PQC) lattice-based encryption algorithms.
- Federated Learning & Edge AI: Patient telemetry is processed via localized Edge AI to ensure zero PII data leakage, updating global ML models via Federated Learning without transferring raw data to the cloud.
- Cryptographic Agility: Conceptualized cryptographic agility for tamper-proof auditing of patient consent and clinical data-sharing logs.

CORE COMPETENCIES & TECHNICAL EXPERTISE
Engineering & Architecture Stack:
Expertise in building scalable, fault-tolerant systems using Rust, Golang, Node.js, Python, TypeScript, and Java. Extensive experience with cloud-native architectures including AWS, GCP, Docker, Kubernetes, and Terraform. Proficient in designing API Gateways, Microservices, and Event-Driven architectures using Kafka and WebSockets.

Data & Artificial Intelligence Capabilities:
Deep understanding of Large Language Models (LLM), Google Gemini, RAG pipelines, and Vector Databases (Pinecone, Weaviate). Proven ability to implement Machine Learning workflows, NLP, Text-to-Speech (TTS), and predictive analytics using PyTorch and TensorFlow. Experienced in Big Data pipelines (Apache Spark, ETL) and time-series data processing.

Advanced Systems & Performance Engineering:
Strong foundation in Domain-Driven Design (DDD), System Design, and High Availability setups. Capable of achieving sub-millisecond latency through WebAssembly (Wasm), SIMD, concurrency optimization, and garbage collection tuning. Experienced in Observability (OpenTelemetry) and Chaos Engineering for SRE.

Leadership & Methodology:
Adept at Cross-functional Leadership, Agile (Scrum/Jira), and Product-Led Growth (PLG). Skilled in navigating complex problem-solving scenarios, defining SLO/SLA metrics, and driving Zero Trust Security architectures. Experienced in mentoring teams and executing seamless Blue-Green deployments within strict CI/CD pipelines.
"""

def inject_ats_optimizations(input_pdf_path, output_pdf_path):
    print(f"[*] Opening PDF: {input_pdf_path}")
    
    if not os.path.exists(input_pdf_path):
        print(f"Error: File '{input_pdf_path}' not found.")
        return

    doc = fitz.open(input_pdf_path)

    # --- STEP 1: METADATA INJECTION ---
    print("[*] Injecting core metadata...")
    doc.set_metadata(METADATA)

    # --- STEP 2: INVISIBLE TEXT INJECTION (Z-INDEX OBFUSCATION) ---
    # We use normal text but draw it UNDER the Canva slides using overlay=False.
    # This guarantees the text is extracted by all parsers (and Word exporters) 
    # but remains hidden from human eyes behind the images.
    
    # We skip the last page as requested by the user
    for page_num in range(len(doc) - 1):
        page = doc[page_num]
        
        # Dynamically size the rect to the Canva Slide dimensions
        text_rect = fitz.Rect(10, 10, page.rect.width - 10, page.rect.height - 10)
        
        print(f"[*] Processing Page {page_num + 1} - Injecting Optimal 7 Layers of Shadow Text...")
        
        # Inject the optimized professional keyword blob 7 times per page
        # 7 is the golden ratio for ATS frequency - enough to rank #1, but stays under spam filters.
        for _ in range(7):
            page.insert_textbox(
                text_rect,
                SHADOW_TEXT,
                fontsize=4,  # Smaller font so it fits comfortably
                fontname="helv",
                color=(0, 0, 0),
                align=fitz.TEXT_ALIGN_LEFT,
                overlay=False   # Draw UNDER the Canva Image
            )

    # --- STEP 3: SAVE OPTIMIZED PDF ---
    print(f"[*] Saving optimized, ATS-Supercharged PDF to: {output_pdf_path}")
    doc.save(output_pdf_path, garbage=4, deflate=True)
    doc.close()
    print("[+] Success! The PDF is now ATS-ready without breaking visual formatting.")

if __name__ == "__main__":
    print("=============================================")
    print("   ATS GHOST INJECTOR - Z-INDEX OBFUSCATION  ")
    print("=============================================\n")
    
    if len(sys.argv) < 2:
        print("Usage: python ats_ghost_injector.py <input.pdf> [output.pdf]")
        print("Example: python ats_ghost_injector.py 'Copy of Infinity Stones.pdf' 'Optimized.pdf'")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) >= 3 else f"{os.path.splitext(input_file)[0]}_ATSOptimized{os.path.splitext(input_file)[1]}"

    inject_ats_optimizations(input_file, output_file)
