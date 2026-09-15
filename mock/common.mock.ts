import { defineMock } from "./base";

const baseTime = 1700000000000;

const mockFiles = [
  {
    file_base: "blog/article/",
    file_name: "cover.png",
    file_type: "image/png",
    file_size: 204800,
    file_url: "https://example.com/cover.png",
    updated_at: baseTime,
  },
  {
    file_base: "blog/album/",
    file_name: "photo.jpg",
    file_type: "image/jpeg",
    file_size: 512000,
    file_url: "https://example.com/photo.jpg",
    updated_at: baseTime,
  },
];

const ok = (data: unknown) => ({ code: 200, data, msg: "ok" });

export default defineMock([
  {
    url: "files",
    method: ["GET"],
    body: ok({
      list: mockFiles,
      total: mockFiles.length,
      page: 1,
      page_size: 10,
    }),
  },
  {
    url: "files",
    method: ["POST"],
    body: ok({ file_info: mockFiles[0] }),
  },
]);
