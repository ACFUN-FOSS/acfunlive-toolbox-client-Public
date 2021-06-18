import {
	Gradient,
	GradientError
} from "./Gradient";

const COLOR = 0;
const POSITION = 1;

class LinearGradient extends Gradient {
	type = "linear";
	angle = null;
	constructor({
		angle = 0,
		stops = undefined
	} = {}) {
		super({
			stops
		});
		this.type = "linear";
		this.angle = angle;
	}

	get angle() {
		return this.angle;
	}

	set angle(value) {
		const error = LinearGradient._angleValidator(value);
		if (error) {
			throw new GradientError(`Wrong angle value, ${error}`);
		}
		this.angle = value;
	}

	get type() {
		return this.type;
	}

	static _angleValidator(value) {
		if (typeof value !== "number") {
			return "must be a number";
		}
		if (value !== Number(value)) {
			return "must be a number";
		}
		if (value < 0) {
			return "must be between 0 and 360";
		}
		if (value > 360) {
			return "must be between 0 and 360";
		}
		return null;
	}

	toString() {
		const stops = this.stops
			.slice()
			.sort((a, b) => a[POSITION] - b[POSITION])
			.map(stop => `${stop[COLOR]} ${(stop[POSITION] * 100).toFixed()}%`)
			.join(", ");
		return `linear-gradient(${this.angle}deg, ${stops})`;
	}

	toRaw() {
		const stops = this.stops
			.slice()
			.sort((a, b) => a[POSITION] - b[POSITION])
			.map(stop => {
				return stop;
			});
		return {
			type: this.type,
			angle: this.angle,
			stops
		};
	}
}

export default LinearGradient;
