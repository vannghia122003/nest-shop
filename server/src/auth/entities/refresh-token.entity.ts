import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { User } from '../../user/entities/user.entity'

@Entity({ name: 'RefreshToken' })
export class RefreshToken {
  @PrimaryColumn()
  token: string

  @Column()
  expiresAt: Date

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User
}
