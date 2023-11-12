import { fork } from "child_process"
import "./summaryChild.js"

export default function summarize(text: string) {
  return new Promise<string>((resolve, reject) => {
    const filename = process.env.NODE_ENV === "production" ? "summaryChild.js" : "summaryChild.ts"
    const filepath = new URL(filename, import.meta.url).pathname
    const forked = fork(filepath)

    forked.on("message", (msg) => {
      console.log("Message from child", msg)
      resolve(msg as string)
    })

    forked.send(text)
  })
}
