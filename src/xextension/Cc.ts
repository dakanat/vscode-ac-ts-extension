import * as vscode from "vscode";
import * as fs from "fs";
import child_process, { ExecFileSyncOptions } from "child_process";
import { acts } from "../AcTsExtension";
import { IExtension } from "../XExtension";

class Cc implements IExtension {
    // implements

    // prop
    name = "C";
    extension = ".c";

    // method
    isSelected(): boolean {
        return acts.extension === this.extension;
    }

    // TODO javaに倣って修正
    // TODO ロジックの共通化
    // TODO implementsからextendsに変更
    checkLang(): void {
        // check
        const config = vscode.workspace.getConfiguration(acts.appid);
        const cmd = acts.expandString(config.get("cChecker"));
        const command = `(${cmd}) 1> ${acts.tmptestoutfile} 2> ${acts.tmptesterrfile}`;
        const options = { cwd: acts.projectpath };
        try {
            child_process.execSync(command, options);
        } catch (ex) {
            const err = fs.readFileSync(acts.tmptesterrfile).toString().trim().replace(/\n/g, "\r\n");
            throw `ERROR: check failed\r\n${err}\r\n`;
        }
    }

    compileTask(): void {
        // compile
        const config = vscode.workspace.getConfiguration(acts.appid);
        const cmd = acts.expandString(config.get("cCompiler"));
        const command = `(${cmd}) 1> ${acts.tmptestoutfile} 2> ${acts.tmptesterrfile}`;
        const options = { cwd: acts.projectpath };
        try {
            child_process.execSync(command, options);
        } catch (ex) {
            const err = fs.readFileSync(acts.tmptesterrfile).toString().trim().replace(/\n/g, "\r\n");
            throw `ERROR: compile failed\r\n${err}\r\n`;
        }
    }

    debugTask(): any {
        throw "ERROR: debug is not supported";
    }

    testTask(): any {
        // test
        const config = vscode.workspace.getConfiguration(acts.appid);
        const cmd = acts.expandString(config.get("cExecutor"));
        const command = `(${cmd}) < ${acts.tmptestinfile} 1> ${acts.tmptestoutfile} 2> ${acts.tmptesterrfile}`;
        const options = { cwd: acts.projectpath };
        const child = child_process.exec(command, options);
        return child;
    }
}
export const cc = new Cc();
