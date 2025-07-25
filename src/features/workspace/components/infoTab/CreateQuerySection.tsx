import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { format } from "sql-formatter";
import hljs from "highlight.js/lib/core";
import sqlLang from "highlight.js/lib/languages/sql";
import "highlight.js/styles/a11y-dark.css";
import { toast } from "sonner";

hljs.registerLanguage("sql", sqlLang);


interface CreateQuerySectionProps {
  data: {
    create_table_query: string;
  };
}

const CreateQuerySection: React.FC<CreateQuerySectionProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  // Memoize the formatted query to optimize performance
  const formattedQuery = useMemo(() => {
    try {
      return format(data.create_table_query, { language: "sql" });
    } catch (error) {
      console.error("Error formatting SQL query:", error);
      return data.create_table_query; // Fallback to raw query if formatting fails
    }
  }, [data.create_table_query]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(data.create_table_query);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error: any) {
      console.error("Failed to copy text:", error);
      toast.error(`Failed to copy text to clipboard, ${error.message}`);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">Create Table Query</CardTitle>
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-2 text-sm transition-colors"
        >
          <Copy className="w-4 h-4" />
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </CardHeader>
      <CardContent>
        <pre
          className="rounded-md p-4 overflow-x-auto max-h-[400px]"
          dangerouslySetInnerHTML={{
            __html: hljs.highlight(formattedQuery, { language: "sql" }).value,
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CreateQuerySection;
