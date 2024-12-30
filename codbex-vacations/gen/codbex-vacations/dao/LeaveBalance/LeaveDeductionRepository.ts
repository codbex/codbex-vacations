import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface LeaveDeductionEntity {
    readonly Id: number;
    Balance?: number;
    Request?: number;
    Days?: number;
}

export interface LeaveDeductionCreateEntity {
    readonly Balance?: number;
    readonly Request?: number;
    readonly Days?: number;
}

export interface LeaveDeductionUpdateEntity extends LeaveDeductionCreateEntity {
    readonly Id: number;
}

export interface LeaveDeductionEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Balance?: number | number[];
            Request?: number | number[];
            Days?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Balance?: number | number[];
            Request?: number | number[];
            Days?: number | number[];
        };
        contains?: {
            Id?: number;
            Balance?: number;
            Request?: number;
            Days?: number;
        };
        greaterThan?: {
            Id?: number;
            Balance?: number;
            Request?: number;
            Days?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Balance?: number;
            Request?: number;
            Days?: number;
        };
        lessThan?: {
            Id?: number;
            Balance?: number;
            Request?: number;
            Days?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Balance?: number;
            Request?: number;
            Days?: number;
        };
    },
    $select?: (keyof LeaveDeductionEntity)[],
    $sort?: string | (keyof LeaveDeductionEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeaveDeductionEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeaveDeductionEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface LeaveDeductionUpdateEntityEvent extends LeaveDeductionEntityEvent {
    readonly previousEntity: LeaveDeductionEntity;
}

export class LeaveDeductionRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_LEAVEDEDUCTION",
        properties: [
            {
                name: "Id",
                column: "LEAVEDEDUCTION_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Balance",
                column: "LEAVEDEDUCTION_BALANCE",
                type: "INTEGER",
            },
            {
                name: "Request",
                column: "LEAVEDEDUCTION_REQUEST",
                type: "INTEGER",
            },
            {
                name: "Days",
                column: "LEAVEDEDUCTION_DAYS",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeaveDeductionRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeaveDeductionEntityOptions): LeaveDeductionEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): LeaveDeductionEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: LeaveDeductionCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_LEAVEDEDUCTION",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAVEDEDUCTION_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeaveDeductionUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_LEAVEDEDUCTION",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "LEAVEDEDUCTION_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeaveDeductionCreateEntity | LeaveDeductionUpdateEntity): number {
        const id = (entity as LeaveDeductionUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeaveDeductionUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_LEAVEDEDUCTION",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAVEDEDUCTION_ID",
                value: id
            }
        });
    }

    public count(options?: LeaveDeductionEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_LEAVEDEDUCTION"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeaveDeductionEntityEvent | LeaveDeductionUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-vacations-LeaveBalance-LeaveDeduction", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-vacations-LeaveBalance-LeaveDeduction").send(JSON.stringify(data));
    }
}
