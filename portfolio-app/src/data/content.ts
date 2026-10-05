export type Tier = "featured" | "compact";
export type Media =
  | { kind: "image"; src: string; alt: string }
  | { kind: "gif"; src: string; alt: string }
  | { kind: "poster"; src: string; alt: string };  // code-generated webp
export interface Project {
  slug: string; title: string; tagline: string;    // tagline <= 12 words
  year: string; tier: Tier; tags: string[];
  metrics: { label: string; value: string }[];     // real numbers only
  body: string[];                                   // sheet paragraphs, <= 3
  media: Media[];                                   // first item = card image
  links: { label: string; href: string }[];
}
export interface Role {
  org: string; title: string; period: string; location: string;
  points: string[];                                 // <= 3, <= 25 words each
}
export interface Certification { name: string; issuer: string; date: string }
export interface Education { school: string; degree: string; period: string; note: string }
export interface Stat { label: string; value: number; suffix: string; decimals?: number }

export const profile = {
  name: "Akhil Prasad Chinthala",
  role: "AI/ML engineer. LLM and computer vision systems.",
  location: "Hyderabad, India",
  email: "prasadakhil0909@gmail.com",
  github: "https://github.com/Akhil-Prasad09",
  linkedin: "https://www.linkedin.com/in/akhil-prasad-972043289/",
  resumePath: "/Akhil_Prasad_Resume.pdf",
};

export const stats: Stat[] = [
  { label: "FER-2013 accuracy", value: 70.6, suffix: "%", decimals: 1 },
  { label: "inference latency", value: 8, suffix: "ms", decimals: 0 },
  { label: "benchmark tasks shipped", value: 100, suffix: "+" },
  { label: "stations analyzed", value: 39, suffix: "" },
  { label: "CGPA", value: 8.64, suffix: "", decimals: 2 },
];

export const projects: Project[] = [
  {
    slug: "knee-mri-detect", tier: "featured", year: "2026",
    title: "Knee MRI Detect",
    tagline: "Deep-learning abnormality detection on knee MRI for clinical decision support",
    tags: ["PyTorch", "EfficientNet-B3", "Grad-CAM", "FastAPI", "React", "Docker"],
    metrics: [
      { label: "Backbone", value: "EfficientNet-B3" },
      { label: "Dataset", value: "MRNet, 3 planes" },
    ],
    body: [
      "Trains per-plane EfficientNet-B3 classifiers on Stanford's MRNet dataset to flag abnormalities, ACL tears, and meniscus tears, with Grad-CAM heatmaps showing the model's evidence on each slice.",
      "Ships as a full product: FastAPI inference API, React viewer, PDF reporting via ReportLab, and a Docker compose stack with Postgres.",
      "Research and decision-support use only, not a medical device.",
    ],
    media: [
      { kind: "image", src: "/media/knee-gradcam-acl.png", alt: "Grad-CAM heatmap over a knee MRI slice highlighting the ACL region" },
      { kind: "image", src: "/media/knee-gradcam-meniscus.png", alt: "Grad-CAM heatmap over a knee MRI slice highlighting the meniscus" },
    ],
    links: [{ label: "GitHub", href: "https://github.com/Akhil-Prasad09/knee-mri-detect" }],
  },
  {
    slug: "ev-apm-agent", tier: "featured", year: "2026",
    title: "EV APM Agent",
    tagline: "Real-time fault detection and degradation tracking for EV charging fleets",
    tags: ["Python", "Anomaly detection", "Streaming", "Docker"],
    metrics: [
      { label: "Fleet", value: "39 stations" },
      { label: "Vendors", value: "5+" },
    ],
    body: [
      "A two-layer watchdog for EV charging networks: a rules engine catches known fault patterns instantly while a learning layer tracks each connector's normal behavior to flag drift before hard failure.",
      "Separates self-recovering blips from faults that need a technician, validated on real telemetry from 39 stations across five vendors. Deploys as a sidecar container next to an existing CMS.",
    ],
    media: [
      { kind: "gif", src: "/media/ev-selfrecovery.gif", alt: "Live decision trace of a self-recovery downgrade on real fleet data" },
      { kind: "image", src: "/media/ev-architecture.svg", alt: "EV APM Agent two-layer architecture diagram" },
      { kind: "image", src: "/media/ev-fpr-chart.png", alt: "False positive rate chart across detection categories" },
    ],
    links: [],
  },
  {
    slug: "rbi-rag-eval", tier: "compact", year: "2026",
    title: "RBI FEMA RAG",
    tagline: "Evaluated question answering over RBI's foreign exchange rules",
    tags: ["RAG", "Hybrid search", "LLM evaluation", "Ollama"],
    metrics: [
      { label: "Retrieval", value: "83% hit@5 vs 59% BM25" },
      { label: "Correct refusals", value: "33% → 75%" },
    ],
    body: [
      "Answers questions from RBI's foreign exchange Master Directions with a local LLM, citing the paragraphs it used. Graded against RBI's own published FAQs, not questions I wrote.",
      "Relevance labels come from pooled judging with a calibrated judge: a local 8B LLM proved unusable as a judge, so an embedding judge with 95% agreement on checked labels replaced it. Every result carries a bootstrap confidence interval.",
      "Only 69 of 186 official FAQ questions are answerable from the directions, and the ungated LLM answered most of the rest anyway. A cross-validated reranker-score gate raised correct refusals from 33% to 75%.",
    ],
    media: [{ kind: "poster", src: "/media/rag.webp", alt: "Passage strips with three retrieved passages feeding an answer node, and a dashed refusal path" }],
    links: [{ label: "GitHub", href: "https://github.com/Akhil-Prasad09/rbi-rag-eval" }],
  },
  {
    slug: "cag-emotion-tracker", tier: "compact", year: "2025",
    title: "CAG Emotion Tracker",
    tagline: "Attention-guided emotion recognition at webcam speed",
    tags: ["PyTorch", "OpenCV", "Streamlit"],
    metrics: [
      { label: "Accuracy", value: "70.6% on FER-2013" },
      { label: "Latency", value: "about 8ms per frame" },
    ],
    body: [
      "A 5M-parameter CNN with squeeze-and-excitation attention, trained on FER-2013 to 70.6% test accuracy across seven emotion classes, above human agreement on the dataset (about 65%) and well ahead of the 38% hand-crafted-feature baseline.",
      "Classification is a cache-augmented lookup: one matrix multiply against in-memory per-class prototype embeddings, holding the full webcam pipeline at about 8ms per frame on CPU. Led a 3-person team through delivery.",
    ],
    media: [{ kind: "poster", src: "/media/emotion.webp", alt: "Emotion class activation poster" }],
    links: [
      { label: "Live demo", href: "https://akhil-prasad09.github.io/cag-emotion-tracker/" },
      { label: "GitHub", href: "https://github.com/Akhil-Prasad09/cag-emotion-tracker" },
    ],
  },
  {
    slug: "dentalbot", tier: "compact", year: "2025",
    title: "Booking Platform with Voice AI",
    tagline: "Live booking product with a voice assistant that converts visitors",
    tags: ["React", "Vite", "Express", "Web Speech API"],
    metrics: [{ label: "Status", value: "Live for a real client" }],
    body: [
      "End-to-end booking web app for a real business client, handling genuine customer bookings: React/Vite frontend on an Express REST API.",
      "A voice-enabled assistant answers service FAQs and converts visitors into bookings. The workflow automates through to Google Sheets sync and email confirmations.",
    ],
    media: [{ kind: "poster", src: "/media/dentalbot.webp", alt: "Voice waveform poster" }],
    links: [],
  },
  {
    slug: "gesture-controller", tier: "compact", year: "2024",
    title: "Hand-Gesture Media Controller",
    tagline: "Touchless macOS media control from hand landmarks",
    tags: ["MediaPipe", "OpenCV", "AppleScript"],
    metrics: [
      { label: "Frame rate", value: "30 FPS" },
      { label: "Response", value: "under 20ms" },
    ],
    body: [
      "Maps MediaPipe hand-landmark detection to macOS volume and playback controls for fully touchless media operation, sustaining 30 FPS with sub-20ms gesture response.",
    ],
    media: [{ kind: "poster", src: "/media/gesture.webp", alt: "Hand landmark constellation poster" }],
    links: [],
  },
  {
    slug: "encrypted-chat", tier: "compact", year: "2025",
    title: "Encrypted Chat Application",
    tagline: "Multi-client desktop chat with encrypted message storage",
    tags: ["Python", "PyQt5", "Sockets", "SQLite", "Fernet"],
    metrics: [{ label: "Encryption", value: "Fernet (AES-128) at rest" }],
    body: [
      "Real-time group chat over a multithreaded socket server, with a PyQt5 client, SQLite history, emoji and desktop notifications. The server encrypts every message with Fernet (AES-128 + HMAC) before storing and broadcasting it, and passwords are salted scrypt hashes. Covered by tests that run a real two-client session.",
    ],
    media: [{ kind: "poster", src: "/media/chatapp.webp", alt: "Encrypted stream poster" }],
    links: [{ label: "GitHub", href: "https://github.com/Akhil-Prasad09/OIBSP/tree/main/Chat%20Application" }],
  },
  {
    slug: "green-basket", tier: "compact", year: "2024",
    title: "Green Basket",
    tagline: "React grocery storefront with a full checkout flow",
    tags: ["React", "JavaScript", "CSS3"],
    metrics: [],
    body: [
      "Responsive grocery storefront built as a React app: dynamic product filtering, cart state management, and a complete checkout flow.",
    ],
    media: [{ kind: "poster", src: "/media/greenbasket.webp", alt: "Produce grid poster" }],
    links: [{ label: "GitHub", href: "https://github.com/Akhil-Prasad09/Projects/tree/main/Green%20Basket" }],
  },
];

export const roles: Role[] = [
  {
    org: "AMIK Technologies", title: "AI Engineering Intern",
    period: "Apr 2026 - Present", location: "Hyderabad, hybrid",
    points: [
      "Builds production RAG pipelines over internal documents, replacing manual lookup with grounded, citation-backed answers.",
      "Ships an automated evaluation harness scoring retrieval relevance, faithfulness, and latency across model and prompt versions.",
      "Serves models behind FastAPI endpoints with token streaming, cost logging, and provider fallback.",
    ],
  },
  {
    org: "Handshake AI", title: "Freelance AI Trainer",
    period: "Jul 2026 - Present", location: "Remote",
    points: [
      "Authors terminal-based benchmark tasks used to evaluate frontier AI coding agents: 100+ tasks across 10 domains.",
      "Ships each task as a reproducible package: spec, Dockerised environment, automated verifier, and reference solution.",
    ],
  },
  {
    org: "Oasis Infobyte", title: "Software Development Intern, Python",
    period: "2024", location: "Remote",
    points: [
      "Delivered five Python applications, each specified, built, and demoed independently.",
      "Highlights: a speech-recognition voice assistant, a REST-integrated weather CLI, and a multi-client TCP chat server.",
    ],
  },
];

export const certifications: Certification[] = [
  { name: "Artificial Intelligence Fundamentals", issuer: "IBM", date: "Oct 2024" },
  { name: "Data Analytics Job Simulation", issuer: "Deloitte Australia via Forage", date: "Oct 2025" },
];

export const education: Education[] = [
  { school: "Matrusri Engineering College", degree: "B.Tech, Information Technology", period: "2023 to 2027", note: "CGPA 8.64" },
  { school: "Sri Chaitanya Junior Kalasala", degree: "Higher Secondary", period: "2023", note: "93%" },
  { school: "The Hyderabad Public School", degree: "Secondary", period: "2021", note: "89%" },
];

export const skills: string[] = [
  "Python", "PyTorch", "TensorFlow", "Hugging Face", "OpenCV", "MediaPipe",
  "RAG", "LLM evaluation", "Vector search", "FastAPI", "React", "Node.js",
  "SQL", "MongoDB", "Docker", "Linux", "Git",
];

export const capabilities = [
  { title: "LLM and generative AI", items: ["Retrieval-augmented generation", "Prompt engineering and structured outputs", "Embeddings and vector search", "LLM evaluation and semantic caching"] },
  { title: "Machine learning and CV", items: ["PyTorch and TensorFlow", "Fine-tuning and transfer learning", "OpenCV and MediaPipe", "Real-time inference optimization"] },
  { title: "Backend and serving", items: ["FastAPI model serving", "Token streaming and fallback", "Latency and cost profiling", "Docker and Linux"] },
  { title: "Web and data", items: ["React and Vite", "Node.js and Express", "MySQL and MongoDB", "Vector databases"] },
];
