import { Controller, Get } from "sdk/http";

import { LeaveBalanceRepository as LeaveBalanceDao } from "codbex-vacations/gen/codbex-vacations/dao/LeaveBalance/LeaveBalanceRepository";
import { LeaveDeductionRepository as LeaveDeductionDao } from "codbex-vacations/gen/codbex-vacations/dao/LeaveBalance/LeaveDeductionRepository";
import { LeaveRequestRepository as LeaveRequestDao } from "codbex-vacations/gen/codbex-vacations/dao/LeaveRequests/LeaveRequestRepository";
import { EmployeeRepository as EmployeeDao } from "codbex-employees/gen/codbex-employees/dao/Employees/EmployeeRepository";

@Controller
class GenerateLeaveDeductionService {

    private readonly leaveRequestDao;
    private readonly leaveDeductionDao;
    private readonly leaveBalanceDao;
    private readonly employeeDao;

    constructor() {
        this.leaveRequestDao = new LeaveRequestDao();
        this.employeeDao = new EmployeeDao();
        this.leaveBalanceDao = new LeaveBalanceDao();
        this.leaveDeductionDao = new LeaveDeductionDao();
    }

    @Get("/leaveRequestData/:leaveRequestId")
    public leaveRequestData(_: any, ctx: any) {
        const leaveRequestId = ctx.pathParameters.leaveRequestId;

        const leaveRequest = this.leaveRequestDao.findById(leaveRequestId);

        const employee = this.employeeDao.findAll({
            $filter: {
                equals: {
                    Id: leaveRequest.Employee
                }
            }
        });

        const currentYear = new Date().getFullYear();

        const leaveBalances = this.leaveBalanceDao.findAll({
            $filter: {
                equals: {
                    Employee: leaveRequest.Employee
                },
                greaterThanOrEqual: { Year: currentYear - 2 },
                greaterThan: { Balance: 0 },
            }
        });

        const deductionsCount = this.leaveDeductionDao.count();

        const remainingLeave = leaveBalances.reduce((sum, lb) => sum + lb.Balance, 0);
        const startDate = new Date(leaveRequest.StartDate);
        const endDate = new Date(leaveRequest.EndDate);

        return {
            "LeaveRequest": leaveRequest,
            "Employee": employee[0].Name,
            "StartDate": startDate.toLocaleDateString(),
            "EndDate": endDate.toLocaleDateString(),
            "RemainingLeave": remainingLeave,
            "LeaveBalances": leaveBalances,
            "DeductionsCount": deductionsCount
        };

    }



}