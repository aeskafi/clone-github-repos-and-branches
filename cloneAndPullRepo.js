// import child_process from "child_process";
import { execSync } from "child_process";
import Util from "util";
const asyncExec = Util.promisify(execSync);

export default (
  repoExists = false,
  username = "",
  repo = "",
  branch = "master"
) => {
  if (!repoExists) {
    let child = execSync(
      `git clone https://${username}:${process.env.PERSONAL_ACCESS_TOKEN}@github.com/${username}/${repo}.git repos/${username}/${repo}`
    );
    console.log(child.toString("utf8"));
  } else {
    // console.log("repoExists is true");
    // console.log("I need to learn more about rebase");

    let child = execSync(
      `cd repos/${username}/${repo} && git pull origin ${branch} --rebase`
    );
    console.log(child.toString("utf8"));
  }
};
