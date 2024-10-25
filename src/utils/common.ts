export function combinePaths(...paths: string[]) {
  return (
    "/" +
    paths
      .filter((path) => path !== "")
      .map((path) => path.replace(/^\/+|\/+$/g, ""))
      .join("/")
  ).replace(/\/+$/, ""); // Loại bỏ dấu / ở cuối nếu có
}
