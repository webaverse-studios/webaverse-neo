import { VRM } from "@pixiv/three-vrm";
import { PhysicsAdapter } from "@webaverse-studios/physics-core";
import { nanoid } from "nanoid";
import { Vector3 } from "three";
import { PhysicsCharacter } from "./PhysicsCharacter";


class PlayerData extends Map {}

/**
 * @class AvatarCharacter Character
 */
export class AvatarCharacter extends PhysicsCharacter {
    /**
     * UUID Of the player.
     *
     * @property {string}
     */
    playerId: string;

    /**
     * Internal storage of player data as a map
     *
     * @property {PlayerData}
     */
    playerData: PlayerData;

    /**
     * The avatar of the player.
     */
    avatar: VRM;

    /**
     * Create a new base character controller.
     *
     * @param {Engine} engine
     */
    constructor({
                    physicsAdapter,
                    avatar,
                }: {
        avatar: VRM;
        physicsAdapter: PhysicsAdapter;
    }) {
        super({ physicsAdapter });

        this.avatar = avatar;
        this.playerId = nanoid();
        this.playerData = new PlayerData();
    }

    update(dir: Vector3) {
        // Update the physics character controller
        super.update(dir);
    }

    /**
     * Destroy the character controller.
     */
    destroy() {}
}
