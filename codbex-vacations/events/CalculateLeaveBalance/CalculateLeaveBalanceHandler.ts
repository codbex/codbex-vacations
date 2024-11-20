import { LeaveRequestRepository } from "../../gen/codbex-vacations/dao/LeaveRequests/LeaveRequestRepository";

export const trigger = (event) => {

    const LeaveRequestDao = new LeaveRequestRepository();

    // const request = event.entity;

    // if (event.operation == "create") {

    //     request.LeaveBalance = request.EmployeeContract.LeaveBalance - request.Days;

    //     LeaveRequestDao.update(request);
    // }
}
