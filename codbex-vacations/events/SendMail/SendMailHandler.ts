import { process } from "sdk/bpm";
import { EmployeeRepository } from "codbex-employees/gen/codbex-employees/dao/Employees/EmployeeRepository";

export const trigger = (event) => {

    const EmployeeDao = new EmployeeRepository();

    if (event.operation === "create") {
        const leaveRequest = event.entity;

        console.log("Here event");

        const fromEmployee = EmployeeDao.findById(leaveRequest.Employee);
        const toManager = EmployeeDao.findById(leaveRequest.Manager);
        const requestId = leaveRequest.Id;

        const processInstanceId = process.start("approve-request", {
            RequestId: requestId,
            From: fromEmployee.Email,
            To: toManager.Email
        });

        if (processInstanceId == null) {
            console.log("Failed to create opportunity action process!");
            return;
        }
    }
}