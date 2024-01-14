import { IGithubUser } from "../typedefs/typedef.index";

export const sortString = (stringList: IGithubUser[]): IGithubUser[] => {
  return stringList.sort((firstName, secondName) => {
    if (firstName.name === null) {
      return 1;
    }

    if (secondName.name === null) {
      return -1;
    }

    if (firstName.name < secondName.name) {
      return -1;
    }

    if (firstName.name > secondName.name) {
      return 1;
    }

    return 0;
  });
};
