import { LeaveRequestRepository } from "../../gen/codbex-vacations/dao/LeaveRequests/LeaveRequestRepository";
import { EmployeeContractRepository } from "../../gen/codbex-contracts/dao/EmployeeContracts/EmployeeContractRepository";
import { EmployeeRepository } from "../../gen/codbex-employees/dao/Employees/EmployeeRepository";
import { JobAssignmentRepository } from "../../gen/codbex-jobs/dao/JobAssignment/JobAssignmentRepository";

export const trigger = (event) => {

    const LeaveRequestDao = new LeaveRequestRepository();
    const EmployeeContractDao = new EmployeeContractRepository();
    const EmployeeDao = new EmployeeRepository();
    const JobAssignmentDao = new JobAssignmentRepository();

    const request = event.entity;

    if (event.operation == "create") {

        const jobAssignment = JobAssignmentDao.findAll({
            $filter: {
                equals: {
                    Employee: request.Employee
                }
            }
        });

        const employeeContract = EmployeeContractDao.findAll({
            $filter: {
                equals: {
                    Id: jobAssignment[0].EmployeeContract
                }
            }
        });

        employeeContract[0].LeaveBalance -= request.Days;

        EmployeeContractDao.update(employeeContract[0]);

        request.LeaveBalance = employeeContract[0].LeaveBalance;
        LeaveRequestDao.update
    }
}
