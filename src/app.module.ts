import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Task } from './tasks/task.entity';
import { DataSource } from 'typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'task-management',
  autoLoadEntities: true, 
  synchronize: true,
  entities: [__dirname + '../**/*.entity{.ts,.js}']
}
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'task-management',
  synchronize: true,
  entities: [__dirname + '../**/*.entity{.ts,.js}']
});


let dataSource: DataSource;

export const ConnectDb = async () => {
    dataSource = await AppDataSource.initialize();
}
    
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TasksModule
  ],
})
export class AppModule {}

