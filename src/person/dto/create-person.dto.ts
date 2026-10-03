import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
  
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(150)
  age?: number;

  @IsOptional()
  @IsBoolean()
  isMarried?: boolean;
}