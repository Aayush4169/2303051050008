# Notification System Design

## Stage 1: REST API Design

### Routes

- POST /notifications
  - Creates a notification for a user or channel.
  - Request body: `{ "userId": "123", "channel": "email", "title": "Welcome", "body": "Thanks for joining" }`
  - Response: `201 Created` with notification payload.
- GET /notifications/:id
  - Fetches a single notification.
  - Response: `200 OK` with notification details.
- GET /notifications
  - Lists notifications with pagination.
  - Response: `200 OK` with `items` and `pagination` metadata.
- PUT /notifications/:id/read
  - Marks a notification as read.
  - Response: `200 OK`.

### JSON

- Use camelCase field names for API payloads.
- Include `id`, `userId`, `channel`, `title`, `body`, `status`, `createdAt`, and `updatedAt` in responses.

### Validation

- Validate required fields such as `userId`, `channel`, `title`, and `body`.
- Reject unsupported channels with `400 Bad Request`.

### Status Codes

- `200 OK` for successful retrieval and updates.
- `201 Created` for successful creation.
- `400 Bad Request` for malformed input.
- `404 Not Found` for missing resources.
- `500 Internal Server Error` for unexpected failures.

## Stage 2: Database Design

### Tables

- `notifications`
  - `id` (UUID, PK)
  - `user_id` (VARCHAR)
  - `channel` (VARCHAR)
  - `title` (VARCHAR)
  - `body` (TEXT)
  - `status` (VARCHAR)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)
- `notification_events`
  - `id` (UUID, PK)
  - `notification_id` (UUID, FK)
  - `event_type` (VARCHAR)
  - `payload` (JSON)
  - `created_at` (TIMESTAMP)

### ER Diagram

```text
users ||--o{ notifications : receives
notifications ||--o{ notification_events : records
```

### Indexes

- `notifications(user_id, created_at)`
- `notifications(status, created_at)`
- `notification_events(notification_id, created_at)`

### Relationships

- One user can have many notifications.
- One notification can have many lifecycle events.

## Stage 3: Optimize SQL

### Bottlenecks

- Full table scans when filtering by `status` or `user_id`.
- Large `TEXT` payloads slowing reads.
- Missing pagination controls on list endpoints.

### Rewrite Query

```sql
SELECT id, user_id, channel, title, status, created_at
FROM notifications
WHERE user_id = $1
  AND status = 'pending'
ORDER BY created_at DESC
LIMIT 50 OFFSET $2;
```

### Indexes

- Create a composite index on `(user_id, status, created_at DESC)`.
- Keep frequently read fields in a compact projection.

## Stage 4: Performance Optimization

### Caching

- Cache notification summaries in Redis for 60 seconds.
- Use cache invalidation on create and read events.

### Pagination

- Page results using `limit` and `offset` or cursor-based pagination.
- Default page size: 25 items.

### Lazy Loading

- Load message bodies only when a notification detail endpoint is requested.
- Avoid fetching full payloads for list endpoints.

### Redis

- Use Redis for hot read paths, job deduplication, and rate limiting.

## Stage 5: Notify All

### Queue

- Use a message queue to decouple notification dispatch from the request path.

### RabbitMQ

- Suitable for task-based and fan-out notification workflows.

### Kafka

- Suitable for high-throughput event streaming and replayable histories.

### BullMQ

- Good fit for Node.js services with Redis-backed job processing.

### Retry

- Retry transient failures 3 times with exponential backoff.
- Use jitter to avoid thundering herd behavior.

### Dead Letter Queue

- Route permanently failed jobs to a dead-letter queue for inspection.

## Stage 6: Priority Inbox

### Priority Queue

- Use a priority queue so urgent notifications are processed first.

### Heap

- A binary heap is a practical structure for priority scheduling.

### Sorting Algorithm

- Use heap sort or a heap-based priority ordering for efficient prioritization.

### Complexity

- Insertion: `O(log n)`
- Extraction: `O(log n)`
- Peek: `O(1)`
