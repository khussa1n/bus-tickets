type AuthResponse = {
  token: string;
  data: {
    id: number;
    fullName: string;
    email: string;
  };
};
