import { process } from "sdk/bpm";
import { EmployeeRepository } from "codbex-employees/gen/codbex-employees/dao/Employees/EmployeeRepository";

export const trigger = (event) => {

    const EmployeeDao = new EmployeeRepository();

    if (event.operation === "create") {
        const leaveRequest = event.entity;

        const employee = EmployeeDao.findById(leaveRequest.Employee);
        const manager = EmployeeDao.findById(leaveRequest.Manager);
        const requestId = leaveRequest.Id;

        const processInstanceId = process.start("approve-request", {
            RequestId: requestId,
            From: employee.Email,
            To: manager.Email
        });

        if (processInstanceId == null) {
            console.log("Failed to send mail to manager action process!");
            return;
        }
    }
}