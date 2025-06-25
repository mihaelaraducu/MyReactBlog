export function replaceHtmlTagsRecursive(data: unknown): unknown {
    if (Array.isArray(data)) {
      return data.map((item) => replaceHtmlTagsRecursive(item));
    }
    if (typeof data === "object" && data !== null) {
      const newData: Record<string, unknown> = {};
      for (const key in data as Record<string, unknown>) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          newData[key] = replaceHtmlTagsRecursive(
            (data as Record<string, unknown>)[key]
          );
        }
      }
      return newData;
    }
    if (typeof data === "string") {
      return data.replace(/(<([^>]+)>)/gi, "");
    }
    return data;
  }