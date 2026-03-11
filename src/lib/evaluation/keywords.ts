/**
 * Domain-Specific Keyword Libraries
 * Used for technical depth scoring
 */

export const DOMAIN_KEYWORDS: Record<string, string[]> = {
  frontend: [
    // Core Technologies
    "react", "vue", "angular", "svelte", "nextjs", "typescript", "javascript",
    // State Management
    "redux", "context", "zustand", "recoil", "state", "props",
    // React Concepts
    "hooks", "useeffect", "usestate", "usememo", "usecallback", "useref",
    "lifecycle", "component", "jsx", "virtual dom", "reconciliation",
    // Performance
    "optimization", "memo", "lazy loading", "code splitting", "bundle",
    "performance", "lighthouse", "core web vitals", "ssr", "csr",
    // Styling
    "css", "tailwind", "styled-components", "sass", "flexbox", "grid",
    // Tools
    "webpack", "vite", "babel", "eslint", "prettier",
    // Testing
    "jest", "testing library", "cypress", "playwright", "unit test",
    // Accessibility
    "accessibility", "aria", "semantic html", "wcag",
  ],

  backend: [
    // Languages & Frameworks
    "nodejs", "express", "fastify", "nestjs", "python", "django", "flask",
    "java", "spring", "golang", "rust",
    // Databases
    "postgresql", "mysql", "mongodb", "redis", "database", "sql", "nosql",
    "orm", "prisma", "sequelize", "mongoose", "query", "migration",
    // API Design
    "rest", "graphql", "api", "endpoint", "route", "middleware",
    "authentication", "authorization", "jwt", "oauth", "cors",
    // Architecture
    "microservices", "monolith", "architecture", "design pattern",
    "mvc", "repository", "service layer", "dependency injection",
    // Performance
    "caching", "indexing", "optimization", "scaling", "load balancing",
    "throughput", "latency", "concurrency", "async", "queue",
    // Security
    "security", "encryption", "hashing", "validation", "sanitization",
    "sql injection", "xss", "csrf",
    // DevOps
    "docker", "kubernetes", "ci/cd", "deployment", "monitoring",
    "logging", "error handling",
  ],

  fullstack: [
    // Frontend
    "react", "nextjs", "typescript", "hooks", "component", "state",
    // Backend
    "nodejs", "express", "api", "database", "mongodb", "postgresql",
    // Full Stack Concepts
    "fullstack", "end-to-end", "client-server", "spa", "ssr",
    "authentication", "authorization", "session", "cookie",
    // DevOps
    "deployment", "docker", "ci/cd", "git", "version control",
    // Architecture
    "architecture", "design", "scalability", "performance",
    "rest", "graphql", "websocket",
  ],

  "system-design": [
    // Core Architecture
    "architecture", "system design", "high-level design", "low-level design",
    "microservices", "monolith", "service-oriented", "event-driven",
    "api gateway", "load balancer", "reverse proxy", "cdn",
    // Scalability
    "scalability", "horizontal scaling", "vertical scaling", "auto-scaling",
    "sharding", "partitioning", "replication", "caching", "cache",
    "distributed system", "consistency", "availability", "partition tolerance",
    // Databases & Storage
    "database", "sql", "nosql", "postgresql", "mysql", "mongodb",
    "redis", "cassandra", "dynamodb", "elasticsearch",
    "time-series database", "influxdb", "clickhouse",
    "object storage", "s3", "blob storage", "data lake", "data warehouse",
    // Messaging & Queues
    "message queue", "kafka", "rabbitmq", "pub-sub", "publisher", "subscriber",
    "event streaming", "stream processing", "async", "asynchronous",
    "queue", "topic", "partition", "offset",
    // Performance & Optimization
    "performance", "latency", "throughput", "bottleneck",
    "optimization", "indexing", "query optimization",
    "connection pool", "thread pool", "rate limiting", "throttling",
    // Reliability & Fault Tolerance
    "reliability", "fault tolerance", "high availability", "redundancy",
    "circuit breaker", "retry", "exponential backoff", "timeout",
    "health check", "heartbeat", "failover", "disaster recovery",
    "replication", "master-slave", "leader-follower", "consensus",
    // Security
    "security", "authentication", "authorization", "jwt", "oauth",
    "encryption", "ssl", "tls", "https", "firewall", "waf",
    "ddos protection", "api key", "token",
    // Monitoring & Observability
    "monitoring", "observability", "logging", "metrics", "alerting",
    "prometheus", "grafana", "elk", "splunk", "datadog",
    "tracing", "distributed tracing", "apm",
    // Cloud & Infrastructure
    "cloud", "aws", "azure", "gcp", "kubernetes", "docker",
    "container", "orchestration", "terraform", "infrastructure as code",
    "ec2", "lambda", "cloudfront", "route53", "cloudwatch",
    // Data Patterns
    "cap theorem", "acid", "base", "eventual consistency", "strong consistency",
    "transaction", "two-phase commit", "saga pattern",
    "cqrs", "event sourcing", "materialized view",
    // API & Communication
    "rest", "restful", "graphql", "grpc", "websocket",
    "http", "https", "api", "endpoint", "microservice communication",
    "synchronous", "asynchronous", "request-response", "fire-and-forget",
    // Trade-offs & Concepts
    "trade-off", "bottleneck", "single point of failure", "spof",
    "consistency vs availability", "latency vs throughput",
    "cost optimization", "managed service", "self-hosted",
  ],

  "data-science": [
    // Languages & Tools
    "python", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch",
    "jupyter", "matplotlib", "seaborn", "plotly",
    // Concepts
    "machine learning", "deep learning", "neural network", "model",
    "algorithm", "regression", "classification", "clustering",
    "supervised", "unsupervised", "reinforcement",
    // Statistics
    "statistics", "probability", "hypothesis", "correlation",
    "distribution", "variance", "standard deviation",
    // Data Processing
    "data cleaning", "feature engineering", "preprocessing",
    "normalization", "encoding", "pipeline",
    // Evaluation
    "accuracy", "precision", "recall", "f1 score", "cross validation",
    "overfitting", "underfitting", "bias", "variance",
  ],

  devops: [
    // Containers & Orchestration
    "docker", "kubernetes", "container", "pod", "deployment",
    "helm", "service mesh", "istio",
    // CI/CD
    "ci/cd", "jenkins", "github actions", "gitlab", "pipeline",
    "continuous integration", "continuous deployment",
    // Cloud
    "aws", "azure", "gcp", "cloud", "ec2", "s3", "lambda",
    "kubernetes", "terraform", "cloudformation",
    // Monitoring
    "monitoring", "prometheus", "grafana", "elk", "logging",
    "metrics", "alerting", "observability",
    // Automation
    "automation", "scripting", "ansible", "puppet", "chef",
    "infrastructure as code", "iac",
    // Security
    "security", "secrets management", "vault", "ssl", "tls",
  ],

  flutter: [
    // Core Flutter
    "flutter", "dart", "widget", "stateless", "stateful", "state",
    "statelesswidget", "statefulwidget", "buildcontext", "build method",
    "widget tree", "element tree", "render tree",
    // Lifecycle
    "initstate", "dispose", "didchangedependencies", "lifecycle",
    "setstate", "build", "reassemble", "deactivate",
    // State Management
    "provider", "riverpod", "bloc", "cubit", "getx", "mobx",
    "redux", "state management", "inherited widget", "change notifier",
    "value notifier", "stream builder", "future builder",
    // Navigation
    "navigator", "route", "routing", "go_router", "auto_route",
    "navigation", "push", "pop", "named route",
    // UI & Layout
    "material", "cupertino", "scaffold", "app bar", "column", "row",
    "container", "stack", "positioned", "expanded", "flexible",
    "sized box", "padding", "margin", "alignment",
    // Performance
    "hot reload", "hot restart", "const constructor", "const widget",
    "optimization", "build optimization", "repaint boundary",
    "performance", "devtools", "timeline", "jank",
    // Async & Data
    "async", "await", "future", "stream", "isolate", "compute",
    "json serialization", "http", "dio", "api integration",
    // Firebase & Backend
    "firebase", "firestore", "realtime database", "cloud functions",
    "authentication", "firebase auth", "cloud messaging", "fcm",
    // Storage & Persistence
    "shared preferences", "hive", "sqflite", "local storage",
    "cache", "persistence", "offline support",
    // Platform
    "android", "ios", "cross-platform", "platform channel",
    "method channel", "event channel", "native code", "plugin",
    // Testing
    "widget test", "unit test", "integration test", "test",
    "mockito", "testing", "flutter test", "golden test",
    // Packages
    "pub.dev", "package", "dependency", "pubspec", "yaml",
    "freezed", "injectable", "get_it", "equatable",
    // Advanced
    "custom painter", "animation", "animation controller",
    "tween", "hero animation", "slivers", "custom scroll view",
  ],

  mobile: [
    // Flutter (Core)
    "flutter", "dart", "widget", "stateless", "stateful", "provider",
    "riverpod", "bloc", "state management", "hot reload",
    // React Native
    "react native", "expo", "javascript", "typescript", "jsx",
    "component", "hooks", "navigation", "redux",
    // iOS Development
    "swift", "swiftui", "uikit", "ios", "xcode", "cocoapods",
    "app store", "interface builder", "storyboard",
    // Android Development
    "kotlin", "java", "android", "jetpack compose", "view model",
    "android studio", "gradle", "play store", "activity", "fragment",
    // Cross-Platform Concepts
    "cross-platform", "native", "hybrid", "mobile app", "responsive",
    "platform channel", "native code", "plugin",
    // Mobile-Specific
    "push notification", "deep linking", "biometric", "camera",
    "geolocation", "permissions", "lifecycle", "background task",
    // Performance
    "optimization", "performance", "memory", "battery", "network",
    "offline support", "caching", "lazy loading",
    // Testing & Deployment
    "testing", "unit test", "ui test", "app distribution",
    "ci/cd", "fastlane", "beta testing", "testflight",
  ],

  "backend-java": [
    // Core Java
    "java", "spring", "spring boot", "spring mvc", "spring security",
    "hibernate", "jpa", "orm", "jdbc",
    // Build Tools
    "maven", "gradle", "dependency", "build", "artifact",
    // API & Web
    "rest api", "restful", "graphql", "controller", "service",
    "repository", "dto", "entity", "model",
    // Databases
    "database", "postgresql", "mysql", "oracle", "mongodb",
    "sql", "nosql", "transaction", "connection pool",
    // Security
    "authentication", "authorization", "jwt", "oauth2", "spring security",
    "bcrypt", "role-based access", "filter", "interceptor",
    // Architecture
    "microservices", "monolith", "design pattern", "dependency injection",
    "mvc", "layered architecture", "service layer",
    // Messaging & Async
    "kafka", "rabbitmq", "jms", "async", "queue", "message broker",
    "event-driven", "publisher", "subscriber",
    // Testing
    "junit", "mockito", "testing", "unit test", "integration test",
    "test driven", "mock", "spy",
    // DevOps & Deployment
    "ci/cd", "docker", "kubernetes", "jenkins", "deployment",
    "logging", "slf4j", "log4j", "monitoring",
  ],

  "data-engineer": [
    // Core Languages
    "python", "sql", "scala", "java",
    // Big Data Frameworks
    "spark", "pyspark", "apache spark", "hadoop", "mapreduce",
    "hive", "presto", "flink",
    // Workflow & Orchestration
    "airflow", "apache airflow", "dag", "workflow", "pipeline",
    "luigi", "prefect", "scheduling",
    // ETL & Data Processing
    "etl", "elt", "data pipeline", "batch processing", "streaming",
    "data transformation", "data ingestion", "data lake",
    // Cloud Platforms
    "bigquery", "redshift", "snowflake", "databricks",
    "s3", "gcs", "azure blob", "data warehouse",
    // Streaming
    "kafka", "pubsub", "kinesis", "stream processing",
    "real-time", "event streaming",
    // Data Modeling
    "dbt", "schema", "star schema", "data modeling",
    "normalization", "denormalization", "dimensional modeling",
    // Quality & Governance
    "data quality", "data governance", "data validation",
    "data lineage", "metadata", "data catalog",
    // Optimization
    "optimization", "partitioning", "indexing", "query optimization",
    "performance tuning", "cost optimization",
    // Tools
    "pandas", "numpy", "docker", "kubernetes", "terraform",
  ],

  "ml-engineer": [
    // Core ML Frameworks
    "python", "tensorflow", "pytorch", "keras", "sklearn",
    "scikit-learn", "jax", "mxnet",
    // Machine Learning
    "machine learning", "deep learning", "neural network",
    "supervised learning", "unsupervised learning", "reinforcement learning",
    // Model Types
    "cnn", "rnn", "lstm", "transformer", "bert", "gpt",
    "decision tree", "random forest", "xgboost", "gradient boosting",
    "svm", "linear regression", "logistic regression",
    // Computer Vision
    "cv", "computer vision", "image classification", "object detection",
    "segmentation", "yolo", "resnet", "vgg", "inception",
    // NLP
    "nlp", "natural language processing", "tokenization", "embedding",
    "word2vec", "sentiment analysis", "named entity recognition",
    // Training & Optimization
    "model training", "hyperparameter", "hyperparameter tuning",
    "grid search", "cross validation", "backpropagation",
    "optimizer", "adam", "sgd", "learning rate", "batch size",
    // Evaluation
    "evaluation", "accuracy", "precision", "recall", "f1 score",
    "roc", "auc", "confusion matrix", "loss function",
    "overfitting", "underfitting", "regularization",
    // Data Processing
    "feature engineering", "data preprocessing", "normalization",
    "augmentation", "data pipeline", "pandas", "numpy",
    // Deployment & MLOps
    "deployment", "mlops", "model serving", "inference",
    "docker", "kubernetes", "mlflow", "kubeflow",
    "model versioning", "a/b testing", "monitoring",
  ],

  qa: [
    // Core Testing
    "testing", "qa", "quality assurance", "test engineer",
    "manual testing", "automation", "test automation",
    // Test Types
    "unit test", "integration test", "system test", "acceptance test",
    "regression testing", "smoke testing", "sanity testing",
    "end-to-end testing", "functional testing", "non-functional testing",
    // Automation Tools
    "selenium", "cypress", "playwright", "webdriver",
    "puppeteer", "testcafe", "appium",
    // Testing Frameworks
    "junit", "testng", "pytest", "jest", "mocha",
    "jasmine", "robot framework",
    // API Testing
    "api testing", "rest api", "postman", "rest assured",
    "swagger", "graphql testing", "soap",
    // Performance Testing
    "performance testing", "load testing", "stress testing",
    "jmeter", "gatling", "locust", "k6",
    "throughput", "response time", "latency",
    // Test Management
    "test case", "test plan", "test strategy", "test scenario",
    "bug report", "defect", "jira", "test rail", "zephyr",
    "requirement traceability", "test coverage",
    // Development Practices
    "test driven development", "tdd", "bdd", "behavior driven",
    "cucumber", "gherkin", "given when then",
    // Mocking & Stubbing
    "mock", "stubbing", "mockito", "sinon", "test double",
    "fixture", "fake", "spy",
    // CI/CD
    "ci/cd", "continuous testing", "jenkins", "github actions",
    "test automation framework", "parallel testing",
  ],

  "technical-support": [
    // Core Support Concepts
    "technical support", "helpdesk", "service desk", "it support",
    "customer support", "end user support", "desktop support",
    "incident management", "ticket", "escalation",
    // Troubleshooting
    "troubleshooting", "diagnosis", "root cause", "rca",
    "debugging", "problem solving", "issue resolution",
    "systematic approach", "divide and conquer",
    // Windows & OS
    "windows", "windows 10", "windows 11", "windows server",
    "active directory", "group policy", "gpo", "domain",
    "registry", "event viewer", "task manager", "services",
    "powershell", "command prompt", "cmd", "batch script",
    "startup", "safe mode", "boot", "bios", "uefi",
    // Networking
    "networking", "tcp/ip", "dns", "dhcp", "subnet",
    "ip address", "gateway", "router", "switch", "firewall",
    "vpn", "proxy", "port", "ping", "tracert", "ipconfig",
    "nslookup", "netstat", "lan", "wan", "wifi",
    "ethernet", "network adapter", "nic", "packet loss",
    // Hardware
    "hardware", "cpu", "ram", "memory", "hard drive", "ssd",
    "motherboard", "power supply", "peripheral", "driver",
    "bios update", "firmware", "diagnostic", "hardware failure",
    // Software & Applications
    "software", "application", "install", "uninstall", "update",
    "patch", "patch management", "compatibility", "dependency",
    "license", "activation", "deployment", "package",
    // Remote Support
    "remote desktop", "rdp", "remote assistance", "teamviewer",
    "anydesk", "vnc", "remote access", "screen sharing",
    // Security
    "security", "antivirus", "malware", "virus", "ransomware",
    "firewall", "encryption", "password", "authentication",
    "access control", "permissions", "security patch",
    // Ticketing & ITSM
    "ticketing system", "jira", "servicenow", "freshdesk",
    "zendesk", "sla", "service level agreement", "priority",
    "incident", "request", "change management", "knowledge base",
    // Email & Office
    "email", "outlook", "exchange", "smtp", "imap", "pop3",
    "office 365", "microsoft 365", "sharepoint", "teams",
    "onedrive", "calendar", "pst file", "ost file",
    // Backup & Recovery
    "backup", "restore", "recovery", "disaster recovery",
    "data recovery", "backup solution", "cloud backup",
    // Monitoring & Tools
    "monitoring", "performance monitoring", "disk cleanup",
    "defragmentation", "system restore", "restore point",
    "chkdsk", "sfc", "dism", "msconfig", "regedit",
    // Printers & Peripherals
    "printer", "print spooler", "printer driver", "scanner",
    "usb", "bluetooth", "wireless", "device manager",
    // Cloud & Collaboration
    "cloud", "saas", "g suite", "google workspace",
    "zoom", "webex", "slack", "collaboration tool",
    // Documentation & Communication
    "documentation", "user guide", "walkthrough", "knowledge article",
    "communication", "customer service", "patience", "empathy",
    "clear explanation", "non-technical language",
  ],

  general: [
    // Software Engineering
    "software", "engineering", "development", "programming",
    "algorithm", "data structure", "complexity", "optimization",
    // Best Practices
    "design pattern", "solid", "dry", "kiss", "clean code",
    "refactoring", "testing", "debugging", "documentation",
    // Collaboration
    "git", "version control", "code review", "agile", "scrum",
    "collaboration", "communication", "team", "project",
    // Problem Solving
    "problem solving", "analysis", "solution", "approach",
    "implementation", "troubleshooting", "debugging",
  ],
}

/**
 * Get relevant keywords based on role and interview type
 */
export function getRelevantKeywords(role: string, type: string): string[] {
  const roleLower = role.toLowerCase()
  
  // Map role names to keyword categories
  let roleKeywords: string[] = []
  
  // Flutter/Mobile specific roles
  if (roleLower.includes('flutter') || roleLower.includes('dart')) {
    roleKeywords = DOMAIN_KEYWORDS.flutter || []
  } else if (roleLower.includes('mobile') || roleLower.includes('android') || roleLower.includes('ios') || roleLower.includes('react native')) {
    roleKeywords = DOMAIN_KEYWORDS.mobile || []
  }
  // Backend specializations
  else if (roleLower.includes('java') && (roleLower.includes('backend') || roleLower.includes('spring'))) {
    roleKeywords = DOMAIN_KEYWORDS['backend-java'] || []
  } else if (roleLower.includes('backend') || roleLower.includes('server') || roleLower.includes('api')) {
    roleKeywords = DOMAIN_KEYWORDS.backend || []
  }
  // Data & ML roles
  else if (roleLower.includes('data engineer') || roleLower.includes('etl') || roleLower.includes('pipeline')) {
    roleKeywords = DOMAIN_KEYWORDS['data-engineer'] || []
  } else if (roleLower.includes('ml engineer') || roleLower.includes('machine learning engineer') || roleLower.includes('ai engineer')) {
    roleKeywords = DOMAIN_KEYWORDS['ml-engineer'] || []
  } else if (roleLower.includes('data') || roleLower.includes('ml') || roleLower.includes('machine learning')) {
    roleKeywords = DOMAIN_KEYWORDS['data-science'] || []
  }
  // QA & Testing
  else if (roleLower.includes('qa') || roleLower.includes('quality assurance') || roleLower.includes('test engineer') || roleLower.includes('sdet')) {
    roleKeywords = DOMAIN_KEYWORDS.qa || []
  }
  // Technical Support
  else if (roleLower.includes('support') || roleLower.includes('helpdesk') || roleLower.includes('service desk') || roleLower.includes('desktop support')) {
    roleKeywords = DOMAIN_KEYWORDS['technical-support'] || []
  }
  // Frontend & Fullstack
  else if (roleLower.includes('frontend') || roleLower.includes('react') || roleLower.includes('vue') || roleLower.includes('angular')) {
    roleKeywords = DOMAIN_KEYWORDS.frontend || []
  } else if (roleLower.includes('fullstack') || roleLower.includes('full-stack') || roleLower.includes('full stack')) {
    roleKeywords = DOMAIN_KEYWORDS.fullstack || []
  }
  // DevOps
  else if (roleLower.includes('devops') || roleLower.includes('sre') || roleLower.includes('infrastructure')) {
    roleKeywords = DOMAIN_KEYWORDS.devops || []
  } else {
    // Fallback: try exact match first
    roleKeywords = DOMAIN_KEYWORDS[roleLower] || []
  }
  
  const generalKeywords = DOMAIN_KEYWORDS.general
  const systemDesignKeywords = DOMAIN_KEYWORDS['system-design'] || []

  // For System Design interviews, prioritize system design keywords + role keywords
  if (type === "System Design" || type === "system-design") {
    return [...systemDesignKeywords, ...roleKeywords, ...generalKeywords.slice(0, 10)]
  }

  // For technical interviews, heavily weight role-specific keywords
  if (type === "Technical" || type === "technical") {
    return [...roleKeywords, ...generalKeywords.slice(0, 10)]
  }

  // For behavioral, use general keywords
  if (type === "Behavioral" || type === "behavioral") {
    return generalKeywords
  }

  // Default: combine all
  return [...roleKeywords, ...generalKeywords]
}
