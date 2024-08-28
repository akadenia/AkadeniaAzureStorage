import jsdoc2md from "jsdoc-to-markdown"
import fs from "fs"

async function main() {
  let template = "{{>main}}"
  if (fs.existsSync("README.hbs")) {
    template = fs.readFileSync("README.hbs", "utf-8")
  }
  let docsString = await jsdoc2md.render({
    files: "./dist/*.js",
    "param-list-format": "list",
    "heading-depth": 2,
    template,
    "global-index-format": "none",
    "module-index-format": "none",
    "no-gfm": true,
    "member-index-format": "grouped",
  })

  // Removing any a tags
  docsString = docsString.replace(/<a name=.*?<\/a>/g, "")
  // Replace the content inside <code> tags with the content enclosed in backticks
  docsString = docsString.replace(/<code>(.*?)<\/code>/g, (_, p1) => `\`${p1}\``)
  // Replace any less than operator with the actual
  docsString = docsString.replace(/.&lt;/g, "<")
  // Replace any greater than operator with the actual
  docsString = docsString.replace(/&gt;/g, ">")
  // Replace any function headers with the appropriate ones
  docsString = docsString.replace(/^(###\s+)([a-zA-Z0-9_]+\.)?([a-zA-Z0-9_]+\([^\)]*\))\s*.*$/gm, "$1$3")
  // Replace any links with the the normal text
  docsString = docsString.replace(/\[(.*?)\]\(#.*?\)/g, "$1")
  fs.writeFile("./README.md", docsString, () => {})
}

main()
