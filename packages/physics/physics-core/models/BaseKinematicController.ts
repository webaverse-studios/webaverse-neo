import { Vector3 } from 'three'
import { KinematicController } from './KinematicController'


export class BaseKinematicController extends KinematicController {
    move(direction: Vector3): void {
        throw new Error(
            `[BaseKinematicController:move(${direction})] Using the base kinematic controller is not allowed`
        );
    }

    destroy(): void {
        throw new Error(
            "[BaseKinematicController:destroy] Using the base kinematic controller is not allowed."
        );
    }
}
