namespace robot {
    //https://github.com/4tronix/MiniBit/blob/master/minibit.ts

// Helper Functions
    function clamp(value: number, min: number, max: number): number
    {
        return Math.max(Math.min(max, value), min);
    }

    // slow PWM frequency for slower speeds (0-1023) to improve torque
    function setPWM(speed: number): void
    {
        if (speed < 200)
            pins.analogSetPeriod(AnalogPin.P16, 60000);
        else if (speed < 300)
            pins.analogSetPeriod(AnalogPin.P16, 40000);
        else
            pins.analogSetPeriod(AnalogPin.P16, 30000);
    }

// robot class extension
    class 4tronixMiniBitRobot extends robots.Robot
    {
        constructor()
	{
            super()
            this.sonar = new robots.SR04Sonar(DigitalPin.P15, DigitalPin.P15)
            this.leds = new robots.WS2812bLEDStrip(DigitalPin.P13, 4)
            this.lineDetectors = new robots.PinLineDetectors(DigitalPin.P0, DigitalPin.P2, true)
        }

        motorRun(left: number, right: number)
	{
	    let lSpeed = (clamp(Math.abs(left), 0, 100) * 1023) / 100
	    let rSpeed = (clamp(Math.abs(right), 0, 100) * 1023) / 100

            setPWM((lSpeed+rSpeed)/2)

            if (left < 0)
            {
                pins.analogWritePin(AnalogPin.P12, lSpeed)
                pins.analogWritePin(AnalogPin.P8, 0)
            }
            else
            {
                pins.analogWritePin(AnalogPin.P12, 0)
                pins.analogWritePin(AnalogPin.P8, lSpeed)
            }

            if (right < 0)
            {
                pins.analogWritePin(AnalogPin.P16, rSpeed)
                pins.analogWritePin(AnalogPin.P14, 0)
            }
            else
            {
                pins.analogWritePin(AnalogPin.P16, 0)
                pins.analogWritePin(AnalogPin.P14, rSpeed)
            }
        }
	}
    }

    /**
     * MiniBit from 4tronix
     */
    //% fixedInstance whenUsed block="4tronix minibit" weight=90
    export const 4tronixMiniBit = new RobotDriver(
        new 4tronixMiniBitRobot()
    )
}
