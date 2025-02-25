import type { ReactNode } from "react";

import { Form } from "react-router";

import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { FileField } from "~/components/file-field";
import { TextField } from "~/components/text-field";

export function AssetManager(): ReactNode {
  return (
    <Form encType="multipart/form-data" method="post">
      <Card>
        <p>Use this form to upload assets.</p>
        <TextField name="name" placeholder="Name" />
        <FileField name="contents" />
        <Button type="submit">Upload</Button>
      </Card>
    </Form>
  );
}
