import rapportsData from "./Rapports.json";

interface RapportData {
    id: number;
    title: string;
    listImg?: string[];
    vehiculesInvolved?: string[];
    tags?: string[];
    type?: string;
    officersInvolved?: string[];
    description: string;
    civiliansInvolved?: string[];
    criminalsInvolved?: string[];
    job: string;
    timestamp?: number;
}

export class Rapport {
    private _id: number;
    private _title: string;
    private _listImg: string[];
    private _vehiculesInvolved: string[];
    private _tags: string[];
    private _type: string;
    private _officersInvolved: string[];
    private _description: string;
    private _civiliansInvolved: string[];
    private _criminalsInvolved: string[];
    private _job: string;
    private _timestamp: number;

    constructor(
        id = 0,
        title = "Nouveau Rapport",
        listImg: string[] = [],
        vehiculesInvolved: string[] = [],
        tags: string[] = [],
        type: string | undefined = undefined,
        officersInvolved: string[] = [],
        description = "Template rapport \n\n Date d'ouverture: \n Rempli par: (Nom et matricule) \n\n Détails de l'incident: \n Preuves: \n\n Etat de l'investigation: \n\n Notes additionnelles: ",
        civiliansInvolved: string[] = [],
        criminalsInvolved: string[] = [],
        job: string,
        timestamp: number = Date.now()
    ) {
        this._id = id;
        this._title = title;
        this._listImg = listImg;
        this._vehiculesInvolved = vehiculesInvolved;
        this._tags = tags;
        this._type = type ?? (tags[0] || "Type non défini");
        this._officersInvolved = officersInvolved;
        this._description = description;
        this._civiliansInvolved = civiliansInvolved;
        this._criminalsInvolved = criminalsInvolved;
        this._job = job;
        this._timestamp = timestamp;
    }

    // Getters
    get id(): number { return this._id; }
    get title(): string { return this._title; }
    get listImg(): string[] { return this._listImg; }
    get vehiculesInvolved(): string[] { return this._vehiculesInvolved; }
    get tags(): string[] { return this._tags; }
    get type(): string { return this._type; }
    get officersInvolved(): string[] { return this._officersInvolved; }
    get description(): string { return this._description; }
    get civiliansInvolved(): string[] { return this._civiliansInvolved; }
    get criminalsInvolved(): string[] { return this._criminalsInvolved; }
    get job(): string { return this._job; }
    get timestamp(): number { return this._timestamp; }

    // Setters
    set title(value: string) { this._title = value; }
    set description(value: string) { this._description = value; }
    set tags(value: string[]) { this._tags = value; }
    set type(value: string) { this._type = value; }

    /**
     * Récupère tous les rapports accessibles pour un métier donné
     * Un rapport est accessible si :
     * - Il a été créé par quelqu'un du même métier
     * - OU il possède un tag correspondant au métier
     */
    static getAllReports(metier: string): Rapport[] {
        return this.getAllReportsWithLocalStorage(metier);
    }

    /**
     * Convertit l'instance en objet pour la sérialisation JSON
     */
    toJSON() {
        return {
            id: this._id,
            title: this._title,
            listImg: this._listImg,
            vehiculesInvolved: this._vehiculesInvolved,
            tags: this._tags,
            type: this._type,
            officersInvolved: this._officersInvolved,
            description: this._description,
            civiliansInvolved: this._civiliansInvolved,
            criminalsInvolved: this._criminalsInvolved,
            job: this._job
            , timestamp: this._timestamp
        };
    }

    /**
     * Crée et sauvegarde un nouveau rapport
     */
    static async createReport(reportData: {
        title: string;
        description: string;
        images: string[];
        tags: string[];
        vehicles: string[];
        officers: string[];
        civilians: string[];
        criminals: string[];
    }, job: string): Promise<Rapport> {
        // Générer un nouvel ID (le plus élevé + 1)
        const allRapports: RapportData[] = rapportsData;
        const maxId = allRapports.length > 0 ? Math.max(...allRapports.map(r => r.id)) : 0;
        const newId = maxId + 1;

        // Créer le nouveau rapport
        const newRapport = new Rapport(
            newId,
            reportData.title,
            reportData.images,
            reportData.vehicles,
            reportData.tags,
            reportData.officers,
            reportData.description,
            reportData.civilians,
            reportData.criminals,
            job
        );

        // La sauvegarde se fait maintenant côté serveur via fetchNui
        console.log('Rapport créé, prêt pour sauvegarde serveur:', newRapport.toJSON());

        return newRapport;
    }

    /**
     * Récupère tous les rapports (incluant ceux sauvegardés temporairement)
     */
    static getAllReportsWithLocalStorage(metier: string): Rapport[] {
        try {
            // Essayer d'abord de charger depuis localStorage temporaire (fallback)
            const localReports: RapportData[] = JSON.parse(localStorage.getItem('mdt_reports_temp') || '[]');

            // Récupérer la liste des IDs supprimés (permet de masquer aussi les rapports de base)
            const deletedIds: number[] = JSON.parse(localStorage.getItem('mdt_reports_deleted') || '[]');

            // Combiner avec les rapports par défaut
            const allRapports: RapportData[] = [...rapportsData, ...localReports];

            // Convertir les objets JSON en instances de Rapport
            const rapports = allRapports.map(data => new Rapport(
                data.id,
                data.title,
                data.listImg || [],
                data.vehiculesInvolved || [],
                data.tags || [],
                data.type,
                data.officersInvolved || [],
                data.description,
                data.civiliansInvolved || [],
                data.criminalsInvolved || [],
                data.job,
                data.timestamp ?? Date.now()
            ));

            // Filtrer les rapports accessibles pour ce métier et non supprimés
            return rapports.filter(rapport => {
                // Masquer les rapports marqués supprimés
                if (deletedIds.includes(rapport.id)) return false;

                // Le rapport est accessible si :
                // 1. Il a été créé par quelqu'un du même métier
                const createdBySameJob = rapport.job?.toLowerCase() === metier.toLowerCase();

                // 2. OU il possède un tag correspondant au métier (ex: tag "LSPD" visible par job "lspd")
                const hasMatchingTag = rapport.tags?.some(
                    tag => tag.toUpperCase() === metier.toUpperCase()
                );

                return createdBySameJob || hasMatchingTag;
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des rapports:', error);
            // Fallback vers la méthode originale
            return this.getAllReports(metier);
        }
    }
}