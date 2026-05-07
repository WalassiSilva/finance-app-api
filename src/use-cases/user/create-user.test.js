import { EmailAlreadyInUseError } from "../../errors/user.js";
import { CreateUserUseCase } from "./create-user.js";
import { faker } from "@faker-js/faker";

describe("Create User Use Case", () => {
  class GetUserByEmailRepositoryStub {
    async execute() {
      return null;
    }
  }
  class CreateUserRepositoryStub {
    async execute(user) {
      return user;
    }
  }
  class PasswordHasherAdapterStub {
    async execute() {
      return "hashed_password";
    }
  }
  class IdGeneratorAdapterStub {
    execute() {
      return "generated_id";
    }
  }

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const createUserRepository = new CreateUserRepositoryStub();
    const passwordHasherAdapter = new PasswordHasherAdapterStub();
    const idGeneratorAdapter = new IdGeneratorAdapterStub();

    const sut = new CreateUserUseCase(
      getUserByEmailRepository,
      createUserRepository,
      passwordHasherAdapter,
      idGeneratorAdapter,
    );
    return {
      sut,
      getUserByEmailRepository,
      createUserRepository,
      passwordHasherAdapter,
      idGeneratorAdapter,
    };
  };

  const user = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({
      length: 7,
    }),
  };

  it("Should create an user successfully", async () => {
    //arrange
    const { sut } = makeSut();
    //act
    const createdUser = await sut.execute(user);
    //assert
    expect(createdUser).toBeTruthy();
  });
  it("Should throw an EmailAlreadyInUseError when GetUserByEmailRepository return an user", async () => {
    //arrange
    const { sut, getUserByEmailRepository } = makeSut();
    jest.spyOn(getUserByEmailRepository, "execute").mockReturnValueOnce(user);
    //act
    const promise = sut.execute(user);
    //assert
    await expect(promise).rejects.toThrow(
      new EmailAlreadyInUseError(user.email),
    );
  });
  it("Should thow if GetUserByEmailRepository throws", async () => {
    //arrange
    const { sut, getUserByEmailRepository } = makeSut();
    jest
      .spyOn(getUserByEmailRepository, "execute")
      .mockRejectedValueOnce(new Error());
    //act
    const promise = sut.execute(user);
    //assert
    await expect(promise).rejects.toThrow();
  });
  it("Should execute IdGeneratorAdapter", async () => {
    // arrange
    const { sut, idGeneratorAdapter, createUserRepository } = makeSut();
    const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, "execute");
    const createUserRepositorySpy = jest.spyOn(createUserRepository, "execute");

    // act
    await sut.execute(user);

    // assert
    expect(idGeneratorSpy).toHaveBeenCalled();
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      password: "hashed_password",
      id: "generated_id",
    });
  });
  it("should call PasswordHasherAdapter to cryptograph password", async () => {
    // arrange
    const { sut, passwordHasherAdapter, createUserRepository } = makeSut();
    const passwordHasherSpy = jest.spyOn(passwordHasherAdapter, "execute");
    const createUserRepositorySpy = jest.spyOn(createUserRepository, "execute");

    // act
    await sut.execute(user);

    // assert
    expect(passwordHasherSpy).toHaveBeenCalledWith(user.password);
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      password: "hashed_password",
      id: "generated_id",
    });
  });
  it("Should throw if IdGeneratorAdapter throws", async () => {
    //arrange
    const { sut, idGeneratorAdapter } = makeSut();
    jest.spyOn(idGeneratorAdapter, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    //act
    const promise = sut.execute(user);
    //assert
    await expect(promise).rejects.toThrow();
  });
  it("Should thow if PasswordHasherAdapter throws", async () => {
    //arrange
    const { sut, passwordHasherAdapter } = makeSut();
    jest
      .spyOn(passwordHasherAdapter, "execute")
      .mockRejectedValueOnce(new Error());
    //act
    const promise = sut.execute(user);
    //assert
    await expect(promise).rejects.toThrow();
  });
  it("Should throws if CreateUserRepository throws", async () => {
    //arrange
    const { sut, createUserRepository } = makeSut();
    jest
      .spyOn(createUserRepository, "execute")
      .mockRejectedValueOnce(new Error());
    //act
    const promise = sut.execute(user);
    //assert
    await expect(promise).rejects.toThrow();
  });
});
