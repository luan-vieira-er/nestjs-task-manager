import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Task } from './tasks/task.entity';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

// export const typeOrmConfig: TypeOrmModuleOptions = {
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: 'postgres',
//   password: 'postgres',
//   database: 'task-management',
//   autoLoadEntities: true, 
//   synchronize: true,
//   entities: [__dirname + '../**/*.entity{.ts,.js}']
// }
// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: 'postgres',
//   password: 'postgres',
//   database: 'task-management',
//   synchronize: true,
//   entities: [__dirname + '../**/*.entity{.ts,.js}']
// });


// let dataSource: DataSource;

// export const ConnectDb = async () => {
//     dataSource = await AppDataSource.initialize();
// }

// ConnectDb()
    
@Module({
  imports: [
    ConfigModule.forRoot({ 
      envFilePath: [`.env.stage.${process.env.STAGE}`]
    }),
    // TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
          type: 'postgres',
          autoLoadEntities: true, 
          synchronize: true,
          entities: [__dirname + '../**/*.entity{.ts,.js}'],
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
      })
    }),
    TasksModule,
    AuthModule
  ],
})
export class AppModule {}

