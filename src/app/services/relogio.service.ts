import { Injectable } from '@angular/core';
import { TipoRelogio } from '../models/tipo-relorio.enum';
import { MemoriaService } from './memoria.service';

@Injectable({
  providedIn: 'root'
})
export class RelogioService {
  status = TipoRelogio.INATIVO;

  hh = 0;
  mm = 0;
  ss = 0;

  intervalo = 1000;
  tempo: any = '00:00:00';
  crom: any;

  constructor(
    private memoriaService: MemoriaService
  ) { }

  iniciar(): void {
    this.crom = setInterval(() => { this.timer(); }, this.intervalo);
    this.status = TipoRelogio.INICIADO;
  }

  pausar(): void {
    clearInterval(this.crom);
    this.status = TipoRelogio.PARADO;
  }

  parar(): void {
    clearInterval(this.crom);

    this.hh = 0;
    this.mm = 0;
    this.ss = 0;

    this.tempo = '00:00:00';
    this.status = TipoRelogio.PARADO;
  }

  timer(): void {
    this.ss++;

    if (this.ss === 59) {
      this.ss = 0;
      this.mm++;

      if (this.mm === 59) {
        this.mm = 0;
        this.hh++;
      }
    }

    const hora = (this.hh < 10 ? '0' + this.hh : this.hh);
    const minuto = (this.mm < 10 ? '0' + this.mm : this.mm);
    const segundo = (this.ss < 10 ? '0' + this.ss : this.ss);

    this.tempo = hora + ':' + minuto + ':' + segundo;

    this.validar();
  }

  validar(): void {
    const tempo = new Date((this.memoriaService.memoriaPlacar.duracao * 60) * 1000).toISOString().substr(11, 8);
    if (this.memoriaService.memoriaPlacar && (tempo === this.tempo || this.tempo === '00:59:59')) {
      this.parar();
      this.memoriaService.relogioMemoria(true);
      return;
    }

    this.memoriaService.relogioMemoria(false);
  }
}
