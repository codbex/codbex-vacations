import { AnnualLeaveBalanceService } from './AnnualLeaveBalanceService';

import { EmployeeRepository } from "codbex-employees/gen/codbex-employees/dao/Employees/EmployeeRepository";
import { LeaveBalanceRepository } from "codbex-vacations/gen/codbex-vacations/dao/LeaveBalance/LeaveBalanceRepository";
import { EmployeeContractRepository } from "codbex-contracts/gen/codbex-contracts/dao/EmployeeContracts/EmployeeContractRepository";


const EmployeeContractDao = new EmployeeContractRepository();
const LeaveBalanceDao = new LeaveBalanceRepository();
const EmployeeDao = new EmployeeRepository();

const employees = EmployeeDao.findAll();

employees.forEach((employee) => {

    const leaveBalancesCount = LeaveBalanceDao.count();

    const employeeContract = EmployeeContractDao.findAll({
        $filter: {
            equals: {
                Employee: employee.Id
            }
        }
    });


    const leaveBalance = {
        "id": leaveBalancesCount + 1,
        "employee": employee.Id,
        "year": new Date().getFullYear(),
        "granted": employeeContract[0].AnnualPaidLeave,
        "used": 0,
        "balance": employeeContract[0].AnnualPaidLeave
    }

    AnnualLeaveBalanceService.insertLeaveBalance(leaveBalance);
});
