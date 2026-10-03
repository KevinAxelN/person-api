import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class UpdatePersonDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
  
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(150)
  age?: number;

  @IsOptional()
  @IsBoolean()
  isMarried?: boolean;
}