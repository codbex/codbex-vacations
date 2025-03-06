import { process } from "sdk/bpm"
import { sendMail } from "./mail-util"

const execution = process.getExecutionContext();
const executionId = execution.getId();

const toWho = process.getVariable(executionId, "From");
const approver = process.getVariable(executionId, "Approver");

const subject = "Leave Request Approved";

const content = `<h4>Your leave request has been approved by ${approver}</h4>`;

sendMail(toWho, subject, content);