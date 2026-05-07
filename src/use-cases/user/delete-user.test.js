import { faker } from "@faker-js/faker";
import { DeleteUserUseCase } from "./delete-user";
describe("DeleteUserUseCase", () => {
  const user = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
  };
  class DeleteUserRepositoryStub {
    async execute(userId) {
      return user;
    }
  }
  const makeSut = () => {
    const deleteUserRepository = new DeleteUserRepositoryStub();
    const sut = new DeleteUserUseCase(deleteUserRepository);
    return { sut, deleteUserRepository };
  };

  it("Should delete an user successfully", async () => {
    //arrange
    const { sut } = makeSut();
    //act
    const deletedUser = await sut.execute(user.id);
    //assert
    expect(deletedUser).toEqual(user);
  });
  it("Should call DeleteUserRepository with correct params", async () => {
    //arrange
    const { sut, deleteUserRepository } = makeSut();
    const executeSpy = jest.spyOn(deleteUserRepository, "execute");
    const userId = faker.string.uuid();
    //act
    await sut.execute(userId);
    //assert
    expect(executeSpy).toHaveBeenCalledWith(userId);
  });
  it("Should throws if DeleteUserReposity throws", async () => {
    //arrange
    const { sut, deleteUserRepository } = makeSut();
    jest
      .spyOn(deleteUserRepository, "execute")
      .mockRejectedValueOnce(new Error());
    //act
    const promise = sut.execute(user.userId);
    //assert
    await expect(promise).rejects.toThrow();
  });
});
