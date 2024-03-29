import childProcess from "child_process"
import os from "os"

import type { Plugin } from "vite"

// 判断平台，win平台不支持grep
const isWin = os.type() === "Windows_NT"
const findStr = isWin ? "findstr" : "grep"

let userName

export const RmoveConsole = (): Plugin => {
  return {
    name: "rollup-plugin-remove-ohthers-console",
    enforce: "pre",
    transform: (code, filePath) => {
      if (!userName) userName = childProcess.execSync(`git config user.name`, { encoding: "utf-8" })

      if (!filePath.includes("node_modules") && !filePath.includes("packages") && code.includes(`console.log(`)) {
        const rows = code.split("\n")

        const includesLines = rows.map((row, idx) => (row.includes(`console.log(`) ? idx : undefined)).filter((n) => n)

        const removeLine = includesLines.filter((line) => {
          if (line) {
            const isCommit = childProcess.execSync(`git status --porcelain ${filePath}`, {
              encoding: "utf-8",
            })

            if (isCommit.startsWith("??")) return

            const authorInfo = childProcess.execSync(`git blame -L ${line + 1},${line + 1} --porcelain ${filePath} | ${findStr} "^author"`, {
              encoding: "utf-8",
            })

            const reg = /author (?<author>.*)/
            const author = reg.exec(authorInfo).groups.author

            return ![userName, `Not Committed Yet`].includes(author)
          }
        })

        return rows
          .map((row, idx) => {
            if (removeLine.includes(idx)) {
              return row.replace(/console\.log\((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*\)[;\n]?/g, `{}`)
            }
            return row
          })
          .join("\n")
      }
      return code
    },
  }
}
