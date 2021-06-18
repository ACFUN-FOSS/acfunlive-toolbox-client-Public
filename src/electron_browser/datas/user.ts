export interface Data {
	account: string;
	password: string;
}

export const data = (): Data => {
	return {
		account: "",
		password: ""
	};
};

export interface Profile {
	userID: number;
	nickname: string;
	signature: string;
	verifiedText: string;
	followingCount: number;
	fansCount: number;
	contributeCount: number;
	avatar: string;
	avatarFrame: string;
}

export const profile = (): Profile => {
	return {
		userID: 0,
		nickname: "",
		signature: "",
		verifiedText: "",
		followingCount: 0,
		fansCount: 0,
		contributeCount: 0,
		avatar: "",
		avatarFrame: ""
	};
};

export interface Session {
	userID: number;
	securityKey: string;
	serviceToken: string;
	deviceID: string;
	cookies: Array<string>;
}

export const session = (): Session => {
	return {
		userID: 0,
		securityKey: "",
		serviceToken: "",
		deviceID: "",
		cookies: []
	};
};
