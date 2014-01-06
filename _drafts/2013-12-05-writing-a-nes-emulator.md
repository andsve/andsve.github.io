---
layout: post
title: Writing a NES/Famicom Emulator in C++
grand: true
toc: true
---
## Introduction
So you want to write an NES emulator? The usual question is; "Why write yet another emulator when there are so many allready out there?". My own answer, and I think many would agree; it's fun and something I always wanted to do ever since I started programming.

Writing an emulator can seem like a enormous task, and figuring out where and how to start can be a bit daunting. There are a lot of information out there, the problem is that it's quite scattered and a bit hard to "just" dive into. The main reason for this article is to give something back to the emulation community and help anyone just starting out with their own NES emulator.
The information written here can probably be applied to other architectures than the NES, and generalized to other languages than C/C++.

This document is written as a rough guide, not a true tutorial on how I implemented a NES emulator. This means you will not have a fully working emulator by just using the code examples in this article, you will however have a rough idea how to implement one and where to start on your own. You will encounter problems along the way that I and other people already have run into, this should serve as a good point to start searching for solutions.

I do not claim this is the best or easiest way to implement an emulator, but this is how I did it. Now, lets get started!

**Please note:** Before going further, you should have basic knowledge of how a CPU works.

## Emulating NES Architecture

I'm going to assume you allready have skimmed through one or two NES documentations before coming here. So, you probably have at least a vague idea what the NES hardware consist of. There are a lot of information regarding emulation in general on the internet, as well as in depth information on the NES architecture. I will try to organize a collection of relevant links at the bottom of this article as reference. For the rest of this section I'll try to give a concice description of the hardware and its different units, then we will start to implementing each part in the subsequent sections.

Generally speaking there are two different ways to implement an emulator, either as an interpreter or using some type of dynamic recompilation. This guide will talk about the easiest of the two, namely as an [interpreter](http://en.wikipedia.org/wiki/Interpreter_%28computing%29).

The NES has a CPU chip called 2A03 (2A07 on the PAL versions) which is based on a 8bit [6502 processor](http://en.wikipedia.org/wiki/MOS_Technology_6502), with some additional memory-mapped I/O-registers. An additional chip called the Picture Processing Unit (PPU, also called [2C02](http://nesdev.com/2C02%20technical%20reference.TXT)), sits in the NES and is responsible for, as the name suggest, all graphical operations.

These two chips are quite decoupled and can thus be implemented seperately as two different functions. The benefit of this is that the CPU can be implemented first without any knowledge of how the PPU works, which means the first thing we need to do is "simply" to implement a 6502 CPU simulator.

The NES has 2KB internal RAM, and as previously stated, has something called memory-mapped I/O-registers. This means the CPU does not have specific op codes to access I/O devices, but instead these are hardwired as memory adresses. For example, the PPU and CPU communicate with eachother using such adresses.

Game cartridges that are inserted into the NES also contain memory that is mapped into a special space of the memory adresses. It's this memory that contains the actual game logic. This special memory is called the "Program ROM", or PRG ROM for short. Some game cartridges even have built in, battery powered, RAM used for game saves. The adress space where the PRG ROM and RAM is mapped is however limited, and special units on some cartridges, called memory mappers, is used to swap in and out chunks of a larger memory into this limited space.

** TODO ** write about CHR ROM/RAM and how it is connected to the PPU

** TODO ** write about the iNES format

So, now lets start describing our NES hardware in code, our entry point will have to look something like this:
{% highlight c++ %}
void run_emulator( const char* _rom_path )
{
	// reset flags, registers and memory
	boot_nes();

	// read a NES ROM from path
	iNES_ROM rom = load_rom( _rom_path );

	while (true)
	{
		tick_cpu( rom );
		tick_ppu( rom );
	}
}
{% endhighlight %}
Simple stuff, right? Now we only have to implement these functions, and we should end up with a fully functioning emulator. Just one step at a time...

## Memory
- **TODO** memory layout

## Booting/Reset
- **TODO** First of all, we need to emulated how the hardware boots up. This means reseting all internal flags and registers to their default values.
{% highlight c++ %}
void boot_nes()
{
	// ...
}
{% endhighlight %}

- **TODO** [iNES](http://wiki.nesdev.com/w/index.php/INES) - Cartridge/ROM format used by most NES emulators.
{% highlight c++ %}
iNES_ROM load_rom( const char* _rom_path )
{
	iNES_ROM rom;

	// ...

	return rom;
}
{% endhighlight %}

## Implementing the CPU

- **TODO** cpu loop etc
{% highlight c++ %}
void tick_cpu( iNES_ROM &_rom )
{
	// fetch op code
	// todo

	// ...

	switch (op_code)
	{
		case OPCODE_LDA:
			// do stuff
		break;

		default:
			// unknown or unimplemented op code!
		break;
	};
}
{% endhighlight %}
- **TODO** validation To validate that we have a working simulator, some great people have created some [test-ROMs](https://github.com/christopherpow/nes-test-roms/blob/master/other/nestest.txt) that only test the CPU capabilities and its OP codes.

- **TODO** op codes

- **TODO** memory access

## Unsupported Opcodes

- **TODO** make a list of diffuculties etc

## Implementing the PPU

- **TODO** where to start, making the ppu-tick
{% highlight c++ %}
void tick_ppu( iNES_ROM &_rom )
{
	// ...
}
{% endhighlight %}

- **TODO** memory areas and data chunks

## Implementing the APU
- **TODO** no idea

## Miscellaneous

- **TODO** debugging using nestest.nes
- **TODO** accuracy, counting clock cycles

## Additional Information

- [NesDev Wiki](http://wiki.nesdev.com/w/index.php/Nesdev_Wiki) - One of the greatest sources for NES development, both ROM programming and system architecture information.
- [Blargg's 6502 Emulation Notes](http://slack.net/~ant/nes-emu/6502.html) - Blargg is well known in emulator circles, here are some of his own tips for writing an emulator.
- [NESTech](http://web.textfiles.com/games/nestech.txt) - Good overview of the NES hardware; CPU, PPU and memory info.
- [Emulating the Nintendo Entertainment System by Rupert Shuttleworth](http://www.optimuscopri.me/nes/report.pdf) - A report, with source code, for a computer class. Goes into depth on how he implemented his own NES emulator, a very good read.
- [How To Write a Computer Emulator by Marat Fayzullin](http://fms.komkon.org/EMUL8/HOWTO.html) - An emulation introduction guide written by Marat of [iNES](http://fms.komkon.org/iNES/) fame.
- [nes-test-roms](https://github.com/christopherpow/nes-test-roms) - Collection of test ROMs for testing your NES emulator.


## Changes
- 2013-12-05 - Initial draft
