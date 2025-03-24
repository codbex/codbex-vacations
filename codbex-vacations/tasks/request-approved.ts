import { process } from "sdk/bpm";
import { sendMail } from "./mail-util";

const execution = process.getExecutionContext();
const executionId = execution.getId();

const reviever = process.getVariable(executionId, "Employee");
const approver = process.getVariable(executionId, "Manager");

const subject = "Leave Request Approved";

const content = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #2c3e50;">Leave Request Approved</h2>
    <p>Hello ${reviever},</p>
    <p>Your leave request has been approved by <strong>${approver}</strong>.</p>
    <p>Feel free to reach out if you have any questions.</p>
    <p>Best regards</p>
  </div>
`;

sendMail(reviever, subject, content);
