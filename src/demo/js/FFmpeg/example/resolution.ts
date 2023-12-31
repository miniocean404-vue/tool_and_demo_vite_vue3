import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile } from "@ffmpeg/util"
import FFmpegCommand from "@/demo/js/FFmpeg/ffmpeg-utils/command.ts"
import { download } from "@/demo/js/FFmpeg/utils/download.ts"

export async function change_resolution(ffmpeg: FFmpeg) {
  await ffmpeg.writeFile("/video/convert.webm", await fetchFile("https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm"))

  await FFmpegCommand.change_resolution("/video/convert.webm", "/video/convert.mp4", 1920, 1080)

  const data = (await ffmpeg.readFile("/video/convert.mp4")) as Uint8Array
  download({ fileData: data, fileName: "video", ext: "mp4" })
}
