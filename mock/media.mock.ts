import { defineMock } from "./base";

const baseTime = 1700000000000;

const ok = (data: unknown) => ({ code: 200, data, msg: "ok" });

const batch = (n = 1) => ok({ success_count: n });

/** 相册 */

const mockAlbums = [
  {
    id: 1,
    album_name: "旅行记录",
    album_desc: "出行随拍",
    album_cover: "",
    is_delete: 0,
    status: 1,
    created_at: baseTime,
    updated_at: baseTime,
    photo_count: 2,
  },
  {
    id: 2,
    album_name: "日常",
    album_desc: "生活点滴",
    album_cover: "",
    is_delete: 0,
    status: 1,
    created_at: baseTime,
    updated_at: baseTime,
    photo_count: 0,
  },
];

/** 相片 */

const mockPhotos = [
  {
    id: 1,
    album_id: 1,
    photo_name: "风景一",
    photo_desc: "模拟相片",
    photo_src: "",
    is_delete: 0,
    created_at: baseTime,
    updated_at: baseTime,
  },
  {
    id: 2,
    album_id: 1,
    photo_name: "风景二",
    photo_desc: "模拟相片",
    photo_src: "",
    is_delete: 0,
    created_at: baseTime,
    updated_at: baseTime,
  },
];

/** 上传文件 */

export default defineMock([
  {
    url: "albums",
    method: ["GET"],
    body: ok({ list: mockAlbums, total: mockAlbums.length }),
  },
  { url: "albums/:id", method: ["GET"], body: ok(mockAlbums[0]) },
  { url: "albums", method: ["POST"], body: ok(mockAlbums[0]) },
  { url: "albums/:id", method: ["PUT"], body: ok(mockAlbums[0]) },
  { url: "albums/batch-delete", method: ["POST"], body: batch() },
  { url: "albums/batch-destroy", method: ["POST"], body: batch() },
  { url: "albums/batch-restore", method: ["POST"], body: batch() },
  {
    url: "photos",
    method: ["GET"],
    body: ok({ list: mockPhotos, total: mockPhotos.length }),
  },
  { url: "photos", method: ["POST"], body: ok(mockPhotos[0]) },
  { url: "photos/:id", method: ["PUT"], body: ok(mockPhotos[0]) },
  { url: "photos/batch-delete", method: ["POST"], body: batch() },
  { url: "photos/batch-destroy", method: ["POST"], body: batch() },
  { url: "photos/batch-restore", method: ["POST"], body: batch() },
]);
