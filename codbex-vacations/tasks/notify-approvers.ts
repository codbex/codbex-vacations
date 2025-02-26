// import { configurations as config } from "sdk/core";
import { process } from "sdk/bpm"
import { sendMail } from "./mail-util"

const execution = process.getExecutionContext();
const executionId = execution.getId();

const requester = process.getVariable(executionId, "From");
const approver = process.getVariable(executionId, "To");
const requestId = process.getVariable(executionId, "RequestId");

// const managersEmail = config.get("LEAVE_REQUEST_MANAGERS_EMAIL", "managers-dl@example.com");
const subject = "New leave request";
// const domain = window.location.origin;

// const baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
const approvalLink = "http://localohost:8080/services/web/codbex-vacations/ext/generate/LeaveDeduction/leave-deduction-generate.html?id=" + requestId;

const content = `<h4>A new leave request for [${requester}] has been created</h4>Open the inbox <a href="${approvalLink}" target="_blank">here</a> to process the request.`;

console.log("Here notify approvers");

sendMail(approver, subject, content);