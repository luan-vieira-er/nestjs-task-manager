import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";

import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    // async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    //     const { status, search } = filterDto

    //     const query = this.createQueryBuilder('task')

    //     if (status){
    //         query.andWhere('task.status = :status', { status })
    //     }

    //     if (search){
    //         query.andWhere(
    //             'task.title ILIKE :search OR task.description ILIKE :search', { search: `%${search}%` }
    //         )
    //     }

    //     const tasks = await query.getMany()
    //     return tasks
    // }

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void>{
        const { username, password } = authCredentialsDto

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = this.create({
            username,
            password: hashedPassword
        })

        try {
            await this.save(user)
        } catch (error) {
            if (error.code === '23505'){ //Duplicate Username
                throw new ConflictException('Username already exists')
            } else {
                throw new InternalServerErrorException()
            }

        }
    }

    // async deleteTask(id: string){
    //     return await this.delete(id)
    // }
}