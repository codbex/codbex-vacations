import { insert } from "sdk/db";

export interface LeaveBalance {
    readonly id: number,
    readonly employee: number,
    readonly year: number,
    readonly granted: number,
    readonly used: number
}

export class AnnualLeaveBalanceService {

    public static insertLeaveBalance(leaveBalanceData: LeaveBalance) {
        const sql = `INSERT INTO "CODBEX_LEAVEBALANCE" ("LEAVEBALANCE_ID","LEAVEBALANCE_EMPLOYEE", "LEAVEBALANCE_YEAR","LEAVEBALANCE_GRANTED","LEAVEBALANCE_USED") values (?,?, ?, ?, ?)`;
        const queryParameters = [leaveBalanceData.id, leaveBalanceData.employee, leaveBalanceData.year, leaveBalanceData.granted, leaveBalanceData.used];
        insert.execute(sql, queryParameters);
    }

}