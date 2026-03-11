type Question = {
  id: string
  category: "technical" | "behavioral" | "hr" | "system-design"
  role: "frontend" | "backend" | "fullstack" | "flutter" | "mobile" | "devops" | "data-science" | "backend-java" | "data-engineer" | "ml-engineer" | "qa" | "technical-support" | "general"
  difficulty: "easy" | "medium" | "hard"
  text: string
  sampleAnswer?: string
}

const QUESTION_BANK: Question[] = [
  // ============================================
  // FLUTTER QUESTIONS
  // ============================================
  
  // Flutter - Easy
  {
    id: "flutter-easy-1",
    category: "technical",
    role: "flutter",
    difficulty: "easy",
    text: "What is Flutter and what are its main advantages over other mobile frameworks?",
    sampleAnswer: "Flutter is Google's open-source UI framework for building cross-platform apps from a single codebase. Advantages include: hot reload for fast development, native performance, expressive UI with widgets, single codebase for iOS/Android/Web, strong community support, and excellent documentation."
  },
  {
    id: "flutter-easy-2",
    category: "technical",
    role: "flutter",
    difficulty: "easy",
    text: "Explain the difference between StatelessWidget and StatefulWidget.",
    sampleAnswer: "StatelessWidget is immutable and doesn't hold state - it builds once based on configuration. StatefulWidget is mutable and maintains state that can change over time using setState(). Use StatelessWidget for static content, StatefulWidget when UI needs to update based on user interaction or data changes."
  },
  {
    id: "flutter-easy-3",
    category: "technical",
    role: "flutter",
    difficulty: "easy",
    text: "What is BuildContext and why is it important?",
    sampleAnswer: "BuildContext represents the location of a widget in the widget tree. It's important for accessing services like Theme, MediaQuery, Navigator, and inherited widgets. Every widget's build method receives a BuildContext parameter to interact with the framework."
  },
  
  // Flutter - Medium
  {
    id: "flutter-medium-1",
    category: "technical",
    role: "flutter",
    difficulty: "medium",
    text: "Explain state management in Flutter. What are the different approaches?",
    sampleAnswer: "State management handles data flow in apps. Approaches include: setState (simple local state), InheritedWidget (passing data down tree), Provider (dependency injection), Riverpod (modern provider), BLoC (business logic separation), GetX (all-in-one), Redux (predictable state container). Choice depends on app complexity and team preference."
  },
  {
    id: "flutter-medium-2",
    category: "technical",
    role: "flutter",
    difficulty: "medium",
    text: "How do you handle asynchronous operations in Flutter?",
    sampleAnswer: "Use Future for single async operations and Stream for continuous data. async/await syntax makes code readable. FutureBuilder widget rebuilds UI when Future completes. StreamBuilder handles stream updates. Common patterns: API calls with http/dio, database queries with sqflite, Firebase listeners."
  },
  {
    id: "flutter-medium-3",
    category: "technical",
    role: "flutter",
    difficulty: "medium",
    text: "What are the Flutter widget lifecycle methods and when are they called?",
    sampleAnswer: "For StatefulWidget: initState() (once on creation), didChangeDependencies() (when InheritedWidget changes), build() (every rebuild), didUpdateWidget() (when configuration changes), dispose() (when removed). Use initState for initialization, dispose for cleanup, build for UI."
  },
  
  // Flutter - Hard
  {
    id: "flutter-hard-1",
    category: "technical",
    role: "flutter",
    difficulty: "hard",
    text: "Explain Flutter's rendering pipeline - how does Flutter draw widgets on screen?",
    sampleAnswer: "Flutter has three trees: Widget tree (configuration), Element tree (lifecycle), RenderObject tree (actual rendering). During build, widgets create elements which create render objects. Render objects perform layout calculations, painting, and compositing. The pipeline: Widget → Element → RenderObject → Layer → Scene → Canvas. This architecture enables hot reload and 60fps performance."
  },
  {
    id: "flutter-hard-2",
    category: "technical",
    role: "flutter",
    difficulty: "hard",
    text: "How would you optimize a Flutter app with performance issues?",
    sampleAnswer: "1. Use const constructors for immutable widgets. 2. Implement RepaintBoundary for expensive widgets. 3. Use ListView.builder instead of ListView for long lists. 4. Avoid rebuilding entire widget tree - optimize setState scope. 5. Profile with DevTools to identify bottlenecks. 6. Use Isolates for heavy computations. 7. Optimize images (caching, compression). 8. Lazy load data and implement pagination."
  },
  
  // ============================================
  // MOBILE (Native & React Native) QUESTIONS
  // ============================================
  
  {
    id: "mobile-easy-1",
    category: "technical",
    role: "mobile",
    difficulty: "easy",
    text: "What are the differences between native and cross-platform mobile development?",
    sampleAnswer: "Native uses platform-specific languages (Swift/Kotlin) for best performance and access to all platform features. Cross-platform (Flutter/React Native) uses single codebase for multiple platforms, faster development but may have performance limitations. Native: better performance, full API access. Cross-platform: code reuse, faster development, lower maintenance cost."
  },
  {
    id: "mobile-medium-1",
    category: "technical",
    role: "mobile",
    difficulty: "medium",
    text: "How do you handle offline data synchronization in mobile apps?",
    sampleAnswer: "1. Store data locally (SQLite, Hive, SharedPreferences). 2. Queue operations when offline. 3. On reconnection, sync pending changes. 4. Handle conflicts (last-write-wins, version vectors). 5. Use libraries like WatermelonDB, Realm. 6. Implement retry mechanisms with exponential backoff. 7. Show offline indicators to users. 8. Firebase Firestore offers built-in offline support."
  },
  {
    id: "mobile-hard-1",
    category: "technical",
    role: "mobile",
    difficulty: "hard",
    text: "Design a strategy for implementing push notifications across iOS and Android.",
    sampleAnswer: "Use Firebase Cloud Messaging (FCM) for unified approach. 1. Register device tokens on app start. 2. Send tokens to backend for storage. 3. Backend uses FCM API to send notifications. 4. Handle notification permissions (request at appropriate time). 5. Implement notification categories/channels. 6. Handle deep linking from notifications. 7. Background/foreground notification handling. 8. Track notification analytics. 9. Implement notification scheduling locally if needed."
  },
  
  // ============================================
  // BACKEND JAVA QUESTIONS
  // ============================================
  
  {
    id: "backend-java-easy-1",
    category: "technical",
    role: "backend-java",
    difficulty: "easy",
    text: "What is Spring Boot and what problems does it solve?",
    sampleAnswer: "Spring Boot is a framework that simplifies Spring application development. It solves: complex configuration (auto-configuration), dependency management (starter dependencies), embedded server setup (Tomcat/Jetty included), production-ready features (actuator, metrics). Enables rapid development with convention over configuration approach."
  },
  {
    id: "backend-java-medium-1",
    category: "technical",
    role: "backend-java",
    difficulty: "medium",
    text: "Explain the difference between @Component, @Service, and @Repository in Spring.",
    sampleAnswer: "All are Spring stereotypes for dependency injection. @Component is generic. @Service marks business logic layer - semantic meaning for service classes. @Repository marks data access layer - enables automatic exception translation from database errors to Spring's DataAccessException. Use @Repository for DAOs, @Service for business logic, @Component for other beans."
  },
  {
    id: "backend-java-hard-1",
    category: "technical",
    role: "backend-java",
    difficulty: "hard",
    text: "How would you implement distributed transactions in a microservices architecture using Spring?",
    sampleAnswer: "Distributed transactions are challenging. Solutions: 1. Saga Pattern - chain of local transactions with compensating transactions for rollback. 2. Event Sourcing - store events, rebuild state. 3. Two-Phase Commit (avoid in microservices). 4. Use Spring Cloud Stream with Kafka for reliable messaging. 5. Implement idempotency. 6. Use Axon Framework or Eventuate for saga orchestration. Prefer eventual consistency over strict ACID."
  },
  
  // ============================================
  // DATA ENGINEER QUESTIONS
  // ============================================
  
  {
    id: "data-engineer-easy-1",
    category: "technical",
    role: "data-engineer",
    difficulty: "easy",
    text: "What is ETL and how does it differ from ELT?",
    sampleAnswer: "ETL (Extract-Transform-Load): Extract data from sources, transform in staging area, load to warehouse. ELT (Extract-Load-Transform): Extract data, load raw into warehouse, transform using warehouse's compute power. ELT is modern approach leveraging cloud data warehouse scalability (Snowflake, BigQuery). ETL better for legacy systems with limited warehouse resources."
  },
  {
    id: "data-engineer-medium-1",
    category: "technical",
    role: "data-engineer",
    difficulty: "medium",
    text: "Explain Apache Airflow and how you would design a data pipeline with it.",
    sampleAnswer: "Airflow orchestrates workflows as Directed Acyclic Graphs (DAGs). Pipeline design: 1. Define DAG with schedule. 2. Create tasks (operators) - extract, transform, load. 3. Set dependencies with >>. 4. Use sensors for external events. 5. Implement error handling and retries. 6. Use XComs for task communication. 7. Monitor via UI. 8. Version control DAG files. Example: extract_task >> transform_task >> load_task >> validation_task."
  },
  {
    id: "data-engineer-hard-1",
    category: "technical",
    role: "data-engineer",
    difficulty: "hard",
    text: "Design a real-time streaming data pipeline for processing millions of events per second.",
    sampleAnswer: "Architecture: 1. Ingestion: Kafka for distributed messaging (partitions for parallelism). 2. Processing: Apache Flink/Spark Streaming for stateful processing. 3. Storage: Time-series DB (InfluxDB) for metrics, data lake (S3) for raw data. 4. Serving: Druid for real-time analytics. 5. Monitoring: Prometheus + Grafana. Handle: backpressure with buffering, exactly-once semantics with Kafka transactions, late data with watermarks, scaling with auto-scaling clusters."
  },
  
  // ============================================
  // ML ENGINEER QUESTIONS
  // ============================================
  
  {
    id: "ml-engineer-easy-1",
    category: "technical",
    role: "ml-engineer",
    difficulty: "easy",
    text: "What is overfitting and how do you prevent it?",
    sampleAnswer: "Overfitting: model learns training data too well but fails on new data. Prevention: 1. Use more training data. 2. Cross-validation. 3. Regularization (L1/L2). 4. Dropout in neural networks. 5. Early stopping. 6. Reduce model complexity. 7. Data augmentation. 8. Ensemble methods. Monitor validation metrics - if training accuracy >> validation accuracy, likely overfitting."
  },
  {
    id: "ml-engineer-medium-1",
    category: "technical",
    role: "ml-engineer",
    difficulty: "medium",
    text: "Explain the difference between precision and recall. When would you optimize for one over the other?",
    sampleAnswer: "Precision = TP/(TP+FP) - of predicted positives, how many correct. Recall = TP/(TP+FN) - of actual positives, how many found. Trade-off exists. Optimize precision when false positives costly (spam detection - don't want real emails marked spam). Optimize recall when false negatives costly (disease detection - don't want to miss sick patients). Use F1-score for balance."
  },
  {
    id: "ml-engineer-hard-1",
    category: "technical",
    role: "ml-engineer",
    difficulty: "hard",
    text: "How would you deploy a machine learning model to production and ensure its reliability?",
    sampleAnswer: "1. Model: Version with MLflow/DVC. 2. Containerize with Docker. 3. API: FastAPI/Flask for inference endpoint. 4. Orchestration: Kubernetes for scaling. 5. Monitoring: Track accuracy drift, latency, errors with Prometheus. 6. A/B testing: Gradual rollout. 7. Retraining: Automated pipeline triggered by performance degradation. 8. Feature store: Consistent features across training/serving. 9. Caching: Cache frequent predictions. 10. Fallback: Shadow mode testing before production."
  },
  
  // ============================================
  // QA / TEST ENGINEER QUESTIONS
  // ============================================
  
  {
    id: "qa-easy-1",
    category: "technical",
    role: "qa",
    difficulty: "easy",
    text: "What is the difference between manual testing and automated testing?",
    sampleAnswer: "Manual testing: Human testers execute test cases, exploring UI, checking functionality. Pros: finds UX issues, good for exploratory testing. Cons: slow, error-prone, not repeatable. Automated testing: Scripts execute tests automatically. Pros: fast, repeatable, reliable, good for regression. Cons: initial setup cost, can't find unexpected issues. Use manual for exploratory/UX, automated for regression/CI/CD."
  },
  {
    id: "qa-medium-1",
    category: "technical",
    role: "qa",
    difficulty: "medium",
    text: "Explain the test pyramid. Why is it important?",
    sampleAnswer: "Test pyramid: Unit tests (base, most tests) > Integration tests (middle) > E2E tests (top, fewest). Rationale: unit tests are fast, cheap, isolated. E2E tests are slow, expensive, brittle. Pyramid ensures: fast feedback, maintainable test suite, good coverage. Anti-pattern: inverted pyramid (too many E2E tests) causes slow CI, flaky tests. Aim for 70% unit, 20% integration, 10% E2E."
  },
  {
    id: "qa-hard-1",
    category: "technical",
    role: "qa",
    difficulty: "hard",
    text: "Design an automated testing strategy for a microservices architecture.",
    sampleAnswer: "1. Unit tests: Each service independently. 2. Contract tests: API contracts with Pact - ensure service compatibility. 3. Integration tests: Service with database/dependencies. 4. Component tests: Service in isolation with mocked dependencies. 5. E2E tests: Critical user journeys (minimal). 6. Performance tests: JMeter/Gatling for load. 7. Chaos engineering: Test resilience. 8. CI/CD: Tests in pipeline stages. 9. Test data: Containerized test databases. 10. Monitoring: Production testing with feature flags."
  },
  
  // ============================================
  // TECHNICAL SUPPORT QUESTIONS
  // ============================================
  
  {
    id: "tech-support-easy-1",
    category: "technical",
    role: "technical-support",
    difficulty: "easy",
    text: "A user reports they can't connect to the internet. Walk me through your troubleshooting steps.",
    sampleAnswer: "Systematic approach: 1. Check if other devices work (isolate issue). 2. Check physical connections (cable, WiFi). 3. Run ipconfig /all to check IP assignment. 4. Ping 127.0.0.1 (test TCP/IP stack). 5. Ping gateway (test local network). 6. Ping 8.8.8.8 (test external connectivity). 7. Run nslookup google.com (test DNS). 8. Check firewall settings. 9. Restart network adapter if needed. 10. Document solution in knowledge base."
  },
  {
    id: "tech-support-medium-1",
    category: "technical",
    role: "technical-support",
    difficulty: "medium",
    text: "Explain the difference between a firewall and a router. How do they work together?",
    sampleAnswer: "Router: Directs network traffic between networks using IP addresses - handles packet routing, NAT, assigns local IPs via DHCP. Firewall: Security device that filters traffic based on rules - blocks unauthorized access, prevents intrusions. Work together: Router connects networks, firewall protects them. Often combined in one device. Firewall can be hardware (network firewall) or software (Windows Firewall on endpoints). Router focuses on connectivity, firewall on security."
  },
  {
    id: "tech-support-hard-1",
    category: "technical",
    role: "technical-support",
    difficulty: "hard",
    text: "A user reports their computer is extremely slow. How would you diagnose and resolve this?",
    sampleAnswer: "Diagnosis: 1. Check Task Manager - identify CPU/memory/disk hogs. 2. Check startup programs (msconfig). 3. Review Event Viewer for errors. 4. Run antivirus scan (malware check). 5. Check disk space and fragmentation. 6. Review installed programs for bloatware. Solutions: 1. Disable unnecessary startup items. 2. Run Disk Cleanup. 3. Uninstall unused programs. 4. Check for Windows updates/patches. 5. Upgrade RAM if needed. 6. Run sfc /scannow for system file issues. 7. Consider SSD upgrade. 8. Document resolution steps for knowledge base."
  },
  
  // ============================================
  // DEVOPS QUESTIONS
  // ============================================
  
  {
    id: "devops-easy-1",
    category: "technical",
    role: "devops",
    difficulty: "easy",
    text: "What is CI/CD and why is it important?",
    sampleAnswer: "CI/CD: Continuous Integration (automatically test code changes) + Continuous Deployment (automatically deploy to production). Benefits: faster releases, fewer bugs, rapid feedback, reduced manual work, consistent deployments. CI: developers merge frequently, automated tests run. CD: automated deployment pipeline. Tools: Jenkins, GitHub Actions, GitLab CI. Enables DevOps culture of fast, reliable releases."
  },
  {
    id: "devops-medium-1",
    category: "technical",
    role: "devops",
    difficulty: "medium",
    text: "Explain Infrastructure as Code. What are its benefits?",
    sampleAnswer: "IaC: Managing infrastructure through code (Terraform, CloudFormation, Ansible). Benefits: version control for infrastructure, reproducible environments, faster provisioning, reduced human error, documentation as code, disaster recovery, cost tracking. Define resources declaratively, apply with tools. Changes are reviewed like code. Enables treating infrastructure like software - test, review, automate."
  },
  {
    id: "devops-hard-1",
    category: "technical",
    role: "devops",
    difficulty: "hard",
    text: "Design a zero-downtime deployment strategy for a high-traffic application.",
    sampleAnswer: "Blue-Green Deployment: 1. Maintain two identical environments (Blue=live, Green=staging). 2. Deploy new version to Green. 3. Test Green thoroughly. 4. Switch load balancer to Green. 5. Keep Blue as rollback. OR Rolling deployment with Kubernetes: 1. Update Deployment with new image. 2. K8s gradually replaces pods. 3. Health checks ensure readiness. 4. If issues, automatic rollback. Additional: Database migrations (backward compatible), feature flags for gradual rollout, canary deployment (route 5% traffic first), monitoring for errors during deployment."
  },
  
  // ============================================
  // DATA SCIENCE QUESTIONS
  // ============================================
  
  {
    id: "data-science-easy-1",
    category: "technical",
    role: "data-science",
    difficulty: "easy",
    text: "What is the difference between supervised and unsupervised learning?",
    sampleAnswer: "Supervised learning: Training data has labels (input-output pairs). Model learns to predict output from input. Examples: classification (spam detection), regression (price prediction). Unsupervised learning: No labels, model finds patterns. Examples: clustering (customer segmentation), dimensionality reduction (PCA). Supervised needs labeled data (expensive), gives predictions. Unsupervised explores data, finds hidden structure."
  },
  {
    id: "data-science-medium-1",
    category: "technical",
    role: "data-science",
    difficulty: "medium",
    text: "Explain feature engineering and why it's important.",
    sampleAnswer: "Feature engineering: Creating new features from raw data to improve model performance. Techniques: 1. Scaling/normalization. 2. Encoding categoricals (one-hot, label). 3. Creating interaction features. 4. Polynomial features. 5. Binning continuous variables. 6. Date/time features (day of week, hour). 7. Text features (TF-IDF, word embeddings). Important because: good features >> complex models. Domain knowledge crucial. Can dramatically improve accuracy."
  },
  {
    id: "data-science-hard-1",
    category: "technical",
    role: "data-science",
    difficulty: "hard",
    text: "How would you handle a highly imbalanced dataset (e.g., 1% positive class)?",
    sampleAnswer: "Techniques: 1. Resampling: Oversample minority (SMOTE), undersample majority. 2. Class weights: Penalize misclassifying minority. 3. Anomaly detection: Treat as outlier problem. 4. Ensemble: Balanced bagging. 5. Different metric: Don't use accuracy - use precision-recall, F1, AUC-ROC. 6. Generate synthetic data. 7. Collect more minority examples. 8. Threshold tuning: Adjust classification threshold. Combination often works best - e.g., SMOTE + class weights + appropriate metric."
  },
  
  // ============================================
  // FRONTEND QUESTIONS
  // ============================================
  
  {
    id: "fe-easy-1",
    category: "technical",
    role: "frontend",
    difficulty: "easy",
    text: "Can you explain the difference between var, let, and const in JavaScript?",
    sampleAnswer: "var: Function-scoped, hoisted, can be redeclared. let: Block-scoped, not hoisted, can't be redeclared, mutable. const: Block-scoped, not hoisted, can't be redeclared or reassigned (but objects are mutable). Best practice: use const by default, let when reassignment needed, avoid var."
  },
  {
    id: "fe-easy-2",
    category: "technical",
    role: "frontend",
    difficulty: "easy",
    text: "What is the virtual DOM and how does it work in React?",
    sampleAnswer: "Virtual DOM: Lightweight JavaScript representation of actual DOM. How it works: 1. State changes trigger re-render. 2. React creates new virtual DOM tree. 3. Diffing algorithm compares new vs old virtual DOM. 4. React calculates minimal changes needed. 5. Batch update real DOM. Benefits: Better performance by minimizing expensive DOM operations, enables declarative programming."
  },
  {
    id: "fe-easy-3",
    category: "technical",
    role: "frontend",
    difficulty: "easy",
    text: "How would you optimize the performance of a slow-loading web page?",
    sampleAnswer: "Performance optimization: 1. Minimize HTTP requests (bundle assets). 2. Optimize images (compression, lazy loading, WebP format). 3. Use CDN for static assets. 4. Enable browser caching. 5. Minify CSS/JS. 6. Code splitting for large bundles. 7. Defer non-critical JavaScript. 8. Use modern formats (HTTP/2). 9. Optimize fonts (font-display: swap). 10. Measure with Lighthouse."
  },
  
  // Frontend - Medium
  {
    id: "fe-medium-1",
    category: "technical",
    role: "frontend",
    difficulty: "medium",
    text: "Explain the concept of closures in JavaScript. Can you provide a practical use case?",
    sampleAnswer: "Closure: Function that remembers variables from its outer scope even after outer function has returned. Use case: Data privacy - create private variables. Example: function counter() { let count = 0; return () => ++count; } const increment = counter(); increment() returns 1, 2, 3... 'count' is private, only accessible via increment. Common uses: event handlers, callbacks, module pattern, memoization."
  },
  {
    id: "fe-medium-2",
    category: "technical",
    role: "frontend",
    difficulty: "medium",
    text: "How do you handle state management in a large React application? What libraries or patterns do you use?",
    sampleAnswer: "State management approaches: 1. Context API (simple global state). 2. Redux (predictable state container, good for complex apps). 3. Zustand (lightweight, less boilerplate). 4. Recoil (atom-based). 5. TanStack Query (server state). Patterns: Lift state up, composition, custom hooks. For large apps: Redux Toolkit reduces boilerplate. Separate server state (React Query) from client state (Zustand). Choose based on complexity, team familiarity."
  },
  {
    id: "fe-medium-3",
    category: "technical",
    role: "frontend",
    difficulty: "medium",
    text: "What are Web Workers and when would you use them? Can you describe a scenario?",
    sampleAnswer: "Web Workers: JavaScript running in background threads, separate from main thread. Use for CPU-intensive tasks to prevent UI blocking. Scenario: Large dataset processing - parsing/filtering thousands of records. Implementation: Create worker file, postMessage to send data, onmessage to receive results. Benefits: Non-blocking UI, better performance. Limitations: No DOM access, serialization overhead. Use cases: image processing, data parsing, computations."
  },
  
  // Frontend - Hard
  {
    id: "fe-hard-1",
    category: "technical",
    role: "frontend",
    difficulty: "hard",
    text: "Explain how the JavaScript event loop works. How does it handle async operations, promises, and microtasks?",
    sampleAnswer: "Event Loop: 1. Call stack executes synchronous code. 2. Async operations (setTimeout, fetch) go to Web APIs. 3. Callbacks go to task queue (macrotasks). 4. Promises go to microtask queue. 5. Event loop: Check call stack empty → run all microtasks → run one macrotask → repeat. Microtasks (promises) have priority over macrotasks (setTimeout). This enables non-blocking async code. Order: Sync code → Microtasks → Macrotasks."
  },
  {
    id: "fe-hard-2",
    category: "technical",
    role: "frontend",
    difficulty: "hard",
    text: "Design a solution for implementing infinite scroll with virtualization for a list of 100,000 items.",
    sampleAnswer: "Virtualization approach: 1. Only render visible items + buffer. 2. Track scroll position. 3. Calculate visible range based on item height. 4. Render only items in range. 5. Use placeholder elements for total height. Implementation: react-window or react-virtualized libraries. Key concepts: fixed/variable item heights, overscan for smooth scrolling, windowing technique. Performance: Renders ~20-30 items instead of 100K. Memory efficient. Handle: dynamic item heights, scroll restoration, focus management."
  },
  
  // ============================================
  // BACKEND QUESTIONS
  // ============================================
  
  {
    id: "be-easy-1",
    category: "technical",
    role: "backend",
    difficulty: "easy",
    text: "What is the difference between SQL and NoSQL databases? When would you use each?",
    sampleAnswer: "SQL (PostgreSQL, MySQL): Relational, structured schema, ACID transactions, good for complex queries, relationships. NoSQL (MongoDB, Cassandra): Flexible schema, horizontally scalable, eventual consistency. Use SQL for: financial systems, complex relationships, strong consistency. Use NoSQL for: high scalability, flexible data, real-time apps, document storage. Choice depends on data structure, scale, consistency needs."
  },
  {
    id: "be-easy-2",
    category: "technical",
    role: "backend",
    difficulty: "easy",
    text: "Explain what RESTful APIs are. What are the main HTTP methods and their purposes?",
    sampleAnswer: "REST: Architectural style for APIs using HTTP. Principles: Stateless, client-server, cacheable, uniform interface. HTTP Methods: GET (retrieve), POST (create), PUT (update/replace), PATCH (partial update), DELETE (remove). RESTful design: Resource-based URLs (/users/123), proper status codes (200, 201, 404, 500), JSON responses. Best practices: Versioning (/v1/users), pagination, filtering, consistent naming."
  },
  {
    id: "be-easy-3",
    category: "technical",
    role: "backend",
    difficulty: "easy",
    text: "How do you handle authentication and authorization in your applications?",
    sampleAnswer: "Authentication (who you are): JWT tokens, OAuth 2.0, session cookies. Authorization (what you can do): Role-based (RBAC), permission-based. Implementation: 1. User login → verify credentials. 2. Issue JWT token (signed, expiring). 3. Client sends token in Authorization header. 4. Server verifies token signature. 5. Check user roles/permissions. 6. Grant/deny access. Security: HTTPS, secure token storage, token refresh, password hashing (bcrypt)."
  },
  
  // Backend - Medium
  {
    id: "be-medium-1",
    category: "technical",
    role: "backend",
    difficulty: "medium",
    text: "Explain database indexing. How does it improve performance and what are the trade-offs?",
    sampleAnswer: "Index: Data structure (B-tree, hash) that improves query speed. Works like book index. Benefits: Faster SELECT queries, faster WHERE/JOIN/ORDER BY. Trade-offs: Slower INSERT/UPDATE/DELETE (maintain index), uses disk space, slows down writes. Best practices: Index frequently queried columns, foreign keys, composite indexes for multi-column queries. Don't over-index. Monitor query performance."
  },
  {
    id: "be-medium-2",
    category: "technical",
    role: "backend",
    difficulty: "medium",
    text: "How would you design a rate limiting system for an API?",
    sampleAnswer: "Rate limiting strategies: 1. Token bucket (burst allowed). 2. Leaky bucket (smooth rate). 3. Fixed window (simple, boundary issues). 4. Sliding window (accurate). Implementation: Redis for distributed tracking, middleware layer, return 429 status. Key: user ID or IP. Headers: X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After. Considerations: Different limits per endpoint/tier, graceful degradation, monitoring."
  },
  {
    id: "be-medium-3",
    category: "technical",
    role: "backend",
    difficulty: "medium",
    text: "What strategies do you use for error handling and logging in production systems?",
    sampleAnswer: "Error handling: 1. Try-catch blocks with specific errors. 2. Global error middleware. 3. Proper HTTP status codes. 4. User-friendly messages (hide stack traces). 5. Error tracking (Sentry, Rollbar). Logging: 1. Structured logging (JSON). 2. Log levels (error, warn, info, debug). 3. Centralized logging (ELK, Datadog). 4. Include context (request ID, user ID). 5. Avoid logging sensitive data. 6. Log aggregation for analysis. Production: Alert on critical errors, log rotation."
  },
  
  // Backend - Hard
  {
    id: "be-hard-1",
    category: "technical",
    role: "backend",
    difficulty: "hard",
    text: "Design a distributed caching system that handles cache invalidation across multiple servers.",
    sampleAnswer: "Architecture: 1. Cache layer: Redis cluster with sharding (consistent hashing). 2. Invalidation strategies: Time-based (TTL), event-based (pub/sub), write-through, write-back. 3. Pub/Sub: Redis pub/sub to notify all servers of invalidation. 4. Versioning: Cache keys include version number. 5. Fallback: If cache miss, query DB and populate cache. 6. Monitoring: Cache hit rate, latency. Challenges: Cache coherence, thundering herd (use locks), network partitions. Consider: Cache-aside pattern, read-through, write-through based on use case."
  },
  {
    id: "be-hard-2",
    category: "technical",
    role: "backend",
    difficulty: "hard",
    text: "Explain database transactions and ACID properties. How would you handle a distributed transaction?",
    sampleAnswer: "ACID: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent safety), Durability (permanent). Transactions: BEGIN → operations → COMMIT/ROLLBACK. Distributed transactions: 1. Two-Phase Commit (2PC): Prepare phase, commit phase - slow, blocking. 2. Saga Pattern (better): Sequence of local transactions, compensating transactions for rollback. 3. Event Sourcing: Store events, eventual consistency. Modern approach: Avoid distributed transactions, use eventual consistency, idempotency, message queues."
  },
  
  // ============================================
  // FULLSTACK QUESTIONS
  // ============================================
  
  {
    id: "fs-easy-1",
    category: "technical",
    role: "fullstack",
    difficulty: "easy",
    text: "Walk me through how a web request travels from the browser to the server and back.",
    sampleAnswer: "1. User enters URL in browser. 2. DNS lookup converts domain to IP. 3. Browser makes HTTP request to server IP. 4. Request goes through network (routers, ISP). 5. Reaches server load balancer. 6. Load balancer forwards to application server. 7. Server processes request (database queries, business logic). 8. Server sends HTTP response back. 9. Response travels back through network. 10. Browser receives HTML/CSS/JS. 11. Browser renders page. Each step adds latency - optimize with CDN, caching, compression."
  },
  {
    id: "fs-easy-2",
    category: "technical",
    role: "fullstack",
    difficulty: "easy",
    text: "What is CORS and why is it important? How do you handle it in your applications?",
    sampleAnswer: "CORS: Cross-Origin Resource Sharing - security mechanism that restricts resources from different origins. Browser blocks requests from different domain/port unless server allows. Importance: Prevents malicious sites from accessing your API. Implementation: Server sets headers: Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers. Options: Allow specific origins, credentials, preflight requests. Backend (Express): use cors middleware. Production: Whitelist trusted domains, avoid wildcard (*)."
  },
  {
    id: "fs-easy-3",
    category: "technical",
    role: "fullstack",
    difficulty: "easy",
    text: "Explain the difference between server-side rendering and client-side rendering.",
    sampleAnswer: "SSR: HTML generated on server, sent to browser (Next.js, traditional). Pros: Better SEO, faster initial load, works without JS. Cons: Slower navigation, higher server load. CSR: Browser receives minimal HTML, JavaScript renders content (React SPA). Pros: Fast navigation, interactive, less server load. Cons: Slow initial load, SEO challenges, requires JS. Hybrid: Next.js with SSR + client hydration. Choose based on: SEO needs, interactivity, performance requirements."
  },
  
  // Fullstack - Medium
  {
    id: "fs-medium-1",
    category: "technical",
    role: "fullstack",
    difficulty: "medium",
    text: "How would you implement real-time features in a web application (like live chat or notifications)?",
    sampleAnswer: "Technologies: WebSockets (bi-directional, persistent connection), Server-Sent Events (server push), Long Polling (fallback). Implementation: 1. Frontend: Connect to WebSocket (Socket.io library). 2. Backend: WebSocket server (Node.js + ws library). 3. Message broker: Redis pub/sub for multi-server. 4. Scaling: Load balancer with sticky sessions or Redis adapter. 5. Fallback: Long polling for old browsers. 6. Error handling: Reconnection logic, heartbeat. Use cases: chat, notifications, collaborative editing."
  },
  {
    id: "fs-medium-2",
    category: "technical",
    role: "fullstack",
    difficulty: "medium",
    text: "Describe how you would architect a file upload system that handles large files efficiently.",
    sampleAnswer: "Architecture: 1. Chunked upload: Split file into chunks (5-10MB each). 2. Frontend: File API + FormData, upload chunks sequentially/parallel. 3. Backend: Receive chunks, store temporarily, assemble on completion. 4. Storage: S3/cloud storage for files, DB for metadata. 5. Resumable: Track uploaded chunks, allow retry. 6. Validation: File type, size limits, virus scanning. 7. Progress: WebSocket for real-time updates. 8. Optimization: Direct S3 upload with pre-signed URLs. Security: Authentication, rate limiting."
  },
  {
    id: "fs-medium-3",
    category: "technical",
    role: "fullstack",
    difficulty: "medium",
    text: "What security measures do you implement to protect against common web vulnerabilities?",
    sampleAnswer: "Security measures: 1. XSS: Sanitize input, escape output, CSP headers. 2. SQL Injection: Parameterized queries, ORMs. 3. CSRF: CSRF tokens, SameSite cookies. 4. Authentication: Secure password hashing (bcrypt), 2FA, rate limiting. 5. Authorization: RBAC, principle of least privilege. 6. Headers: HTTPS only, X-Frame-Options, X-Content-Type-Options. 7. Validation: Input validation client + server. 8. Dependencies: Regular updates, security audits. 9. Secrets: Environment variables, never commit."
  },
  
  // Fullstack - Hard
  {
    id: "fs-hard-1",
    category: "technical",
    role: "fullstack",
    difficulty: "hard",
    text: "Design a system to handle 1 million concurrent users. What technologies and architecture would you use?",
    sampleAnswer: "Architecture: 1. Load Balancer: NGINX/ALB distributing traffic. 2. API Servers: Stateless Node.js/Go services (horizontal scaling with K8s). 3. Database: PostgreSQL with read replicas, connection pooling. 4. Cache: Redis cluster for sessions and hot data. 5. Message Queue: Kafka for async processing. 6. CDN: CloudFront for static assets. 7. WebSockets: Managed service or custom with Redis pub/sub. 8. Monitoring: Prometheus + Grafana, distributed tracing. 9. Auto-scaling: Based on CPU/memory metrics. Cost: $50K-100K/month. Handle: 10K+ requests/second."
  },
  {
    id: "fs-hard-2",
    category: "technical",
    role: "fullstack",
    difficulty: "hard",
    text: "Explain how you would implement end-to-end encryption for a messaging application.",
    sampleAnswer: "E2E Encryption: Messages encrypted on sender device, decrypted on receiver device only. Implementation: 1. Key Generation: Each user generates public/private key pair (RSA/ECC). 2. Key Exchange: Diffie-Hellman for shared secret. 3. Encryption: Sender encrypts with receiver's public key (or shared secret with AES). 4. Server: Stores encrypted messages, no decryption capability. 5. Decryption: Receiver uses private key. 6. Forward Secrecy: Rotate keys frequently. 7. Challenges: Key management, group chats (multiple recipients), metadata leakage. Libraries: libsodium, Signal Protocol."
  },
  
  // ============================================
  // SYSTEM DESIGN QUESTIONS
  // ============================================
  
  {
    id: "sys-1",
    category: "system-design",
    role: "general",
    difficulty: "hard",
    text: "Design a URL shortening service like bit.ly. Consider scalability and analytics.",
    sampleAnswer: "Components: 1. URL generation: Base62 encoding or hash (MD5 + collision handling). 2. Database: Key-value store (Redis) for fast lookup, PostgreSQL for persistence. 3. API: POST to create short URL, GET to redirect. 4. Caching: Redis cache for hot URLs. 5. Load balancer: Distribute requests. 6. Analytics: Kafka + stream processing for click tracking. 7. Scale: Sharding by URL hash, CDN for static content. 8. Expiration: TTL on URLs. Handle: 1B URLs, 10K QPS. Cost: ~$500/month on cloud."
  },
  {
    id: "sys-2",
    category: "system-design",
    role: "general",
    difficulty: "hard",
    text: "How would you design a notification system that delivers notifications via email, SMS, and push?",
    sampleAnswer: "Architecture: 1. API Gateway: Receives notification requests. 2. Message Queue (Kafka): Decouples producers/consumers. 3. Notification Service: Reads from queue, determines delivery channels. 4. Channel Services: Email (SendGrid), SMS (Twilio), Push (FCM). 5. Template Service: Store notification templates. 6. User Preferences: DB storing user channel preferences. 7. Retry Logic: Handle failures with exponential backoff. 8. Analytics: Track delivery status. 9. Rate Limiting: Prevent spam. 10. Priority Queue: Urgent notifications first."
  },
  {
    id: "sys-3",
    category: "system-design",
    role: "general",
    difficulty: "hard",
    text: "Design a social media feed system. How would you rank and personalize content for users?",
    sampleAnswer: "Feed Generation: 1. Fanout approach: Write fanout (push to followers' feeds on post) or read fanout (pull on request). Hybrid for celebrities. 2. Storage: Cassandra for feed storage (user_id + timestamp). 3. Ranking: ML model using features: post recency, engagement (likes/comments), user affinity, post type. 4. Personalization: User interests, past interactions, follow graph. 5. Caching: Redis for user feeds. 6. Real-time updates: WebSocket for live updates. 7. Pagination: Cursor-based. 8. CDN: For media. Handle billions of users, millions of posts/second."
  },
  {
    id: "sys-4",
    category: "system-design",
    role: "general",
    difficulty: "hard",
    text: "Design a video streaming service like YouTube. Focus on video storage and delivery.",
    sampleAnswer: "Architecture: 1. Upload: Chunked upload to S3, trigger transcoding pipeline. 2. Transcoding: AWS MediaConvert - multiple resolutions (360p, 720p, 1080p), HLS/DASH format. 3. Storage: S3 for videos, metadata in PostgreSQL. 4. CDN: CloudFront for global distribution. 5. Adaptive Streaming: Client selects quality based on bandwidth. 6. Recommendation: ML model for content discovery. 7. Search: Elasticsearch for video metadata. 8. Analytics: Kafka for view tracking. Scale: Petabytes of storage, 10M+ concurrent viewers. Cost optimization: S3 lifecycle policies, CDN caching."
  },
  
  // ============================================
  // BEHAVIORAL QUESTIONS
  // ============================================
  
  {
    id: "beh-1",
    category: "behavioral",
    role: "general",
    difficulty: "medium",
    text: "Tell me about a time when you had to deal with a difficult team member. How did you handle it?",
    sampleAnswer: "STAR format: Situation: Team member consistently missed deadlines. Task: Ensure project success while maintaining team harmony. Action: 1. Private conversation to understand issues (personal problems affecting work). 2. Collaborated on solutions (adjusted timeline, redistributed tasks). 3. Regular check-ins for support. 4. Documented agreements. Result: Improved performance, met project deadline, strengthened team relationship. Learning: Empathy and communication key to resolving conflicts."
  },
  {
    id: "beh-2",
    category: "behavioral",
    role: "general",
    difficulty: "medium",
    text: "Describe a challenging technical problem you solved. What was your approach?",
    sampleAnswer: "STAR: Situation: Production database query causing 30-second page loads. Task: Fix performance without downtime. Action: 1. Analyzed query execution plan. 2. Identified missing index on foreign key. 3. Tested index in staging - improved to 0.5 seconds. 4. Created index during low-traffic period. 5. Monitored metrics post-deployment. Result: 60x performance improvement, better user experience. Learning: Always profile before optimizing, proper indexing crucial for database performance."
  },
  {
    id: "beh-3",
    category: "behavioral",
    role: "general",
    difficulty: "medium",
    text: "Tell me about a time when you had to learn a new technology quickly. How did you approach it?",
    sampleAnswer: "STAR: Situation: Project required Kubernetes, no prior experience. Task: Deploy application in 2 weeks. Action: 1. Official docs + tutorials (hands-on learning). 2. Built demo app locally with Minikube. 3. Studied production best practices. 4. Pair programming with DevOps team. 5. Incremental implementation with testing. Result: Successfully deployed on schedule, became team's K8s resource. Learning: Structured learning + hands-on practice + mentorship accelerates skill acquisition."
  },
  {
    id: "beh-4",
    category: "behavioral",
    role: "general",
    difficulty: "medium",
    text: "Describe a situation where you had to make a trade-off between perfect code and meeting a deadline.",
    sampleAnswer: "STAR: Situation: Feature needed for demo, perfect architecture would take 2 extra weeks. Task: Balance code quality with business needs. Action: 1. Implemented working solution with clear TODOs. 2. Documented technical debt. 3. Communicated trade-offs to stakeholders. 4. Created follow-up refactoring ticket. 5. Added extra tests to mitigate risks. Result: Met deadline, successful demo, refactored post-launch. Learning: Pragmatism important - deliver value while maintaining long-term code health through documentation and planning."
  },
  {
    id: "beh-5",
    category: "behavioral",
    role: "general",
    difficulty: "medium",
    text: "Tell me about a project you're most proud of. What was your role and what made it successful?",
    sampleAnswer: "STAR: Situation: E-commerce platform needed real-time inventory system. Task: Lead technical design and implementation. Action: 1. Designed event-driven architecture with Kafka. 2. Led team of 4 developers. 3. Implemented with Node.js + React. 4. Established testing strategy (90% coverage). 5. Conducted code reviews, mentored junior devs. Result: Zero stock-out errors, 40% revenue increase, promoted to senior. Success factors: Clear architecture, strong testing, team collaboration, stakeholder communication."
  },
  {
    id: "beh-6",
    category: "behavioral",
    role: "general",
    difficulty: "medium",
    text: "How do you handle code reviews? Can you describe a time when you received critical feedback?",
    sampleAnswer: "Approach: Code reviews are learning opportunities, not criticism. Give: Constructive feedback, explain reasoning, suggest alternatives, praise good code. Receive: Open mindset, ask questions, defend if needed, implement improvements. Example: Reviewer noted my n+1 query problem. Initially defensive, but they explained impact. I researched, implemented eager loading, thanked them. Result: Learned important optimization technique, improved relationship. Key: Ego-free collaboration, focus on code quality."
  },
  
  // ============================================
  // HR QUESTIONS
  // ============================================
  
  {
    id: "hr-1",
    category: "hr",
    role: "general",
    difficulty: "easy",
    text: "Can you briefly introduce yourself and tell me about your background?",
    sampleAnswer: "I'm a software engineer with 5 years of experience in full-stack development. I specialize in building scalable web applications using React and Node.js. At my current company, I led the development of a microservices architecture that improved system reliability by 40%. I'm passionate about clean code, continuous learning, and mentoring junior developers. Outside work, I contribute to open-source projects and enjoy studying system design. I'm excited about this role because it aligns with my interest in building impactful products."
  },
  {
    id: "hr-2",
    category: "hr",
    role: "general",
    difficulty: "easy",
    text: "What interests you about this role? Why do you want to work here?",
    sampleAnswer: "Three main reasons: 1. Technical challenges - Your work on distributed systems aligns with my expertise and interests in scalable architecture. 2. Company culture - Your emphasis on innovation and engineering excellence resonates with my values. I'm impressed by your engineering blog and open-source contributions. 3. Growth opportunity - The role offers chances to work with cutting-edge technology and learn from experienced engineers. I'm particularly excited about your initiative in cloud-native development. I believe my background in microservices would let me contribute immediately while growing into new areas like machine learning."
  },
  {
    id: "hr-3",
    category: "hr",
    role: "general",
    difficulty: "easy",
    text: "What are your career goals for the next 3-5 years?",
    sampleAnswer: "Short-term (1-2 years): Deepen expertise in distributed systems and cloud architecture. Become go-to person for technical challenges. Contribute to architectural decisions. Mid-term (3-5 years): Move into technical leadership role - mentoring engineers, leading projects, influencing technical direction. Possibly pursue cloud certifications or advanced degree in computer science. Long-term: Staff/Principal engineer or Engineering Manager, depending on where I find most impact. Throughout: Continuous learning, staying current with technology, contributing to engineering culture, and helping build products that make a difference."
  },
  {
    id: "hr-4",
    category: "hr",
    role: "general",
    difficulty: "easy",
    text: "What do you consider your greatest strength and weakness as a developer?",
    sampleAnswer: "Strength: Problem-solving and systematic debugging. I excel at breaking down complex problems, analyzing root causes, and implementing robust solutions. Recent example: Diagnosed production performance issue by analyzing logs and metrics, reducing latency by 70%. I enjoy diving deep into technical challenges and finding elegant solutions. Weakness: Sometimes over-engineer solutions. I'm working on balancing perfect architecture with practical delivery. Now I actively ask: 'Is this complexity necessary?' and use ADRs to evaluate trade-offs. This has helped me ship faster while maintaining quality, and I've become better at recognizing when 'good enough' is actually good enough."
  },
]

type InterviewConfig = {
  role: string
  type: string
  difficulty: string
}

const MAX_QUESTIONS = 6

/**
 * Select questions for an interview session
 * Returns exactly 6 questions based on config
 */
export function selectQuestions(config: InterviewConfig): Question[] {
  const { role, type, difficulty } = config
  
  // Normalize inputs - map various role names to question bank roles
  let normalizedRole: Question["role"] = "general"
  
  const roleLower = role.toLowerCase()
  
  if (roleLower.includes("flutter")) normalizedRole = "flutter"
  else if (roleLower.includes("mobile") || roleLower.includes("react native") || roleLower.includes("ios") || roleLower.includes("android")) normalizedRole = "mobile"
  else if (roleLower.includes("backend") && roleLower.includes("java")) normalizedRole = "backend-java"
  else if (roleLower.includes("data engineer")) normalizedRole = "data-engineer"
  else if (roleLower.includes("ml") || roleLower.includes("machine learning")) normalizedRole = "ml-engineer"
  else if (roleLower.includes("qa") || roleLower.includes("test") || roleLower.includes("quality")) normalizedRole = "qa"
  else if (roleLower.includes("support") || roleLower.includes("helpdesk") || roleLower.includes("service desk")) normalizedRole = "technical-support"
  else if (roleLower.includes("devops") || roleLower.includes("sre")) normalizedRole = "devops"
  else if (roleLower.includes("data scien")) normalizedRole = "data-science"
  else if (roleLower.includes("frontend") || roleLower.includes("front-end") || roleLower.includes("react") || roleLower.includes("vue")) normalizedRole = "frontend"
  else if (roleLower.includes("backend") || roleLower.includes("back-end")) normalizedRole = "backend"
  else if (roleLower.includes("full") || roleLower.includes("fullstack")) normalizedRole = "fullstack"
  
  const normalizedType = type.toLowerCase().includes("technical")
    ? "technical"
    : type.toLowerCase().includes("behavioral")
    ? "behavioral"
    : type.toLowerCase().includes("system")
    ? "system-design"
    : type.toLowerCase().includes("hr")
    ? "hr"
    : "technical"
  
  const normalizedDifficulty = difficulty.toLowerCase() as "easy" | "medium" | "hard"
  
  // Filter questions - prefer role-specific, fallback to general
  let filtered = QUESTION_BANK.filter((q) => {
    const roleMatch = q.role === normalizedRole || q.role === "general"
    const typeMatch = q.category === normalizedType
    const difficultyMatch = q.difficulty === normalizedDifficulty
    
    return roleMatch && typeMatch && difficultyMatch
  })
  
  // Fallback 1: Broaden to any role with matching type and difficulty
  if (filtered.length < MAX_QUESTIONS) {
    filtered = QUESTION_BANK.filter((q) => {
      const typeMatch = q.category === normalizedType
      const difficultyMatch = q.difficulty === normalizedDifficulty
      return typeMatch && difficultyMatch
    })
  }
  
  // Fallback 2: Just matching type
  if (filtered.length < MAX_QUESTIONS) {
    filtered = QUESTION_BANK.filter((q) => q.category === normalizedType)
  }
  
  // Fallback 3: Any questions of similar difficulty
  if (filtered.length < MAX_QUESTIONS) {
    filtered = QUESTION_BANK.filter((q) => q.difficulty === normalizedDifficulty)
  }
  
  // Final fallback: Use any questions
  if (filtered.length < MAX_QUESTIONS) {
    filtered = [...QUESTION_BANK]
  }
  
  // Shuffle and take exactly MAX_QUESTIONS
  const shuffled = filtered.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, MAX_QUESTIONS)
}

export { MAX_QUESTIONS, QUESTION_BANK }
export type { Question }
