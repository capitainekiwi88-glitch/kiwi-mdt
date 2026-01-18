import bcrypt from 'bcryptjs';

export interface MDTUser {
  id: string;
  username: string;
  passwordHash: string;
  job: string;
  grade: number;
  name: string;
  badge?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export class MDTUsersManager {
  private static users: MDTUser[] = [
    // Utilisateurs de test
    {
      id: "1",
      username: "agent.smith",
      passwordHash: "$2a$10$example.hash.for.demo.purposes.only",
      job: "lspd",
      grade: 3,
      name: "Agent Smith",
      badge: "12345",
      createdAt: new Date("2024-01-01"),
      lastLogin: new Date()
    },
    {
      id: "2",
      username: "dr.wilson",
      passwordHash: "$2a$10$example.hash.for.demo.purposes.only",
      job: "lspdh",
      grade: 4,
      name: "Dr. Wilson",
      badge: "67890",
      createdAt: new Date("2024-01-01"),
      lastLogin: new Date()
    }
  ];

  /**
   * Hash un mot de passe
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Vérifie si un mot de passe correspond au hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Authentifie un utilisateur
   */
  static async authenticate(username: string, password: string): Promise<MDTUser | null> {
    const user = this.users.find(u => u.username === username);
    if (!user) return null;

    const isValidPassword = await this.verifyPassword(password, user.passwordHash);
    if (!isValidPassword) return null;

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();

    return user;
  }

  /**
   * Récupère tous les utilisateurs d'un métier spécifique
   */
  static getUsersByJob(job: string): MDTUser[] {
    return this.users.filter(user => user.job === job);
  }

  /**
   * Récupère tous les utilisateurs (pour la liste des agents)
   */
  static getAllUsers(): MDTUser[] {
    return this.users.map(user => ({
      ...user,
      // Ne pas exposer le hash du mot de passe
      passwordHash: undefined as any
    })).filter(user => user.passwordHash === undefined);
  }

  /**
   * Recherche des utilisateurs par nom ou badge
   */
  static searchUsers(query: string): MDTUser[] {
    const lowercaseQuery = query.toLowerCase();
    return this.users.filter(user =>
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.badge?.toLowerCase().includes(lowercaseQuery) ||
      user.username.toLowerCase().includes(lowercaseQuery)
    ).map(user => ({
      ...user,
      passwordHash: undefined as any
    })).filter(user => user.passwordHash === undefined);
  }

  /**
   * Crée un nouvel utilisateur (pour l'administration)
   */
  static async createUser(userData: Omit<MDTUser, 'id' | 'passwordHash' | 'createdAt'> & { password: string }): Promise<MDTUser> {
    const hashedPassword = await this.hashPassword(userData.password);

    const newUser: MDTUser = {
      id: Date.now().toString(),
      username: userData.username,
      passwordHash: hashedPassword,
      job: userData.job,
      grade: userData.grade,
      name: userData.name,
      badge: userData.badge,
      createdAt: new Date()
    };

    this.users.push(newUser);
    return newUser;
  }

  /**
   * Met à jour un utilisateur
   */
  static async updateUser(id: string, updates: Partial<Omit<MDTUser, 'id' | 'passwordHash' | 'createdAt'> & { password?: string }>): Promise<MDTUser | null> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    const user = this.users[userIndex];

    if (updates.password) {
      updates.passwordHash = await this.hashPassword(updates.password);
      delete updates.password;
    }

    this.users[userIndex] = { ...user, ...updates };
    return this.users[userIndex];
  }

  /**
   * Supprime un utilisateur
   */
  static deleteUser(id: string): boolean {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }

  /**
   * Récupère un utilisateur par son ID
   */
  static getUserById(id: string): MDTUser | null {
    const user = this.users.find(u => u.id === id);
    if (!user) return null;

    return {
      ...user,
      passwordHash: undefined as any
    };
  }

  /**
   * Vérifie si un nom d'utilisateur existe déjà
   */
  static isUsernameTaken(username: string): boolean {
    return this.users.some(u => u.username === username);
  }
}