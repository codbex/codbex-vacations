import { LeaveBalanceRepository } from "../../gen/codbex-vacations/dao/LeaveBalance/LeaveBalanceRepository";

export const trigger = (event) => {

    const LeaveBalanceDao = new LeaveBalanceRepository();

    const item = event.entity;
    const operation = event.operation;

    const leaveBalance = LeaveBalanceDao.findAll({
        $filter: {
            equals: {
                Id: item.Balance
            }
        }
    });

    if (operation == "create") {
        leaveBalance[0].Used += item.Days;
        leaveBalance[0].Balance -= item.Days;
    }

    LeaveBalanceDao.update(leaveBalance[0]);
}