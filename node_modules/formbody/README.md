# formbody

`formbody` is a node.js middleware to handle `multipart/form-data` which returns
handled result as `Reponse.body`;

## Installation

```bash
npm i formbody
```

## Useabe

_typescript example_

```typescript
import { formbody } from 'formbody';

// ...

app.use(formbody);

app.all('/', (req: Request, res: Response) => {
  console.log(req.body);
});
```

## body data

```typescript
type Body = {
  field: string;

  // when the field value is not file
  value?: string;

  // when the field value is file
  file?: {
    buffer: Uint8Array;
    size: number;
    filename: string;
    mimetype: string;
  };
}[];
```
