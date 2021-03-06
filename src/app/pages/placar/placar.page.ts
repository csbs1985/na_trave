import { Component, OnDestroy, OnInit } from '@angular/core';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { Router } from '@angular/router';
import { RelogioService } from 'src/app/services/relogio.service';
import { MemoriaService } from 'src/app/services/memoria.service';
import { TipoEquipe } from 'src/app/models/tipo-equipe.enum';
import { TipoRelogio } from 'src/app/models/tipo-relorio.enum';
import { Resumo } from 'src/app/models/resumo.model';

@Component({
  selector: 'app-placar',
  templateUrl: './placar.page.html',
  styleUrls: ['./placar.page.scss'],
})
export class PlacarPage implements OnInit, OnDestroy {
  readonly textoCabecalho = 'Placar e Cronômetro';

  placarMandante = 0;
  placarVisitante = 0;

  mandantePonto = '00';
  visitantePonto = '00';

  periodo = 1;

  constructor(
    private insomnia: Insomnia,
    private router: Router,
    public memoriaService: MemoriaService,
    public relogioService: RelogioService
  ) { }

  ngOnInit() {
    this.insomnia.keepAwake();
  }

  ngOnDestroy() {
    this.insomnia.allowSleepAgain();
    this.relogioService.parar();
    this.relogioService.status = TipoRelogio.INATIVO;
    this.memoriaService.memoriaResumo = null;
  }

  periodoTrocar(): void {
    this.periodo = this.periodo === 1 ? 2 : 1;
  }

  aumentarPonto(time): void {
    if (time === TipoEquipe.MANDANTE) { this.placarMandante++; } else { this.placarVisitante++; }
    this.formatarPontos(time);
    this.adicionarItemResumo(time);
  }

  dimimuirPonto(time): void {
    if (time === TipoEquipe.MANDANTE) { this.placarMandante--; } else { this.placarVisitante--; }
    this.formatarPontos(time);
    this.removerItemResumo(time);
  }

  formatarPontos(time: TipoEquipe): void {
    let equipePonto = this.placarMandante;
    let ponto = this.mandantePonto;

    if (time === TipoEquipe.VISITANTE) {
      equipePonto = this.placarVisitante;
      ponto = this.visitantePonto;
    }
    if (equipePonto < 1) {
      equipePonto = 0;
      ponto = '00';
    }
    if (equipePonto >= 99) {
      equipePonto = 99;
      ponto = '99';
    }
    ponto = equipePonto.toString().padStart(2, '0');

    if (time === TipoEquipe.MANDANTE) {
      this.placarMandante = equipePonto;
      this.mandantePonto = ponto;
    } else {
      this.placarVisitante = equipePonto;
      this.visitantePonto = ponto;
    }
  }

  adicionarItemResumo(time: TipoEquipe): void {
    const resumoArray: Resumo = {
      equipe: time,
      periodo: this.periodo,
      cronometro: this.memoriaService.memoriaPlacar.cronometro ? this.memoriaService.memoriaPlacar.cronometro : true,
      tempo: this.relogioService.tempo,
      data: new Date().getTime()
    };

    this.memoriaService.resumoMemoria(resumoArray);
    this.alterarPlacar();
  }

  removerItemResumo(time: TipoEquipe): any {
    const resumo = this.memoriaService.memoriaResumo.filter(item => item.equipe === time);
    const arrayTemp = [];
    this.memoriaService.memoriaResumo.forEach(item => {
      if (item.data !== resumo[resumo.length - 1].data) {
        arrayTemp.push(item);
      }
    });
    this.memoriaService.memoriaResumo = arrayTemp;
    this.alterarPlacar();
  }

  alterarPlacar(): void {
    this.memoriaService.memoriaPlacar.mandantePonto = this.placarMandante;
    this.memoriaService.memoriaPlacar.visitantePonto = this.placarVisitante;
  }

  ajustePagina(): void {
    this.router.navigate(['/ajuste-placar']);
  }

  resumoPagina(): void {
    this.router.navigate(['/resumo']);
  }

  botaoVoltar(): void {
    this.router.navigate(['/inicio']);
  }

  RespostaModal(): void {
    this.memoriaService.relogioMemoria(false);
  }

  get mandanteNome(): string {
    if (this.memoriaService.memoriaPlacar &&
      this.memoriaService.memoriaPlacar.mandanteNome) {
      return this.memoriaService.memoriaPlacar.mandanteNome;
    }
    return TipoEquipe.MANDANTE;
  }

  get visitanteNome(): string {
    if (this.memoriaService.memoriaPlacar &&
      this.memoriaService.memoriaPlacar.visitanteNome) {
      return this.memoriaService.memoriaPlacar.visitanteNome;
    }
    return TipoEquipe.VISITANTE;
  }

  get isCronometro(): boolean {
    if (this.memoriaService.memoriaPlacar) {
      return this.memoriaService.memoriaPlacar.cronometro;
    }
  }

  get isIniciado(): boolean {
    if (this.relogioService.status === TipoRelogio.INATIVO || this.relogioService.status === TipoRelogio.PARADO) { return false; };
    return true;
  }

  get isResumo(): boolean {
    if (this.placarMandante === 0 && this.placarVisitante === 0) {
      return false;
    }
    return true;
  }

  get tempoCorrido(): string {
    if (this.memoriaService.memoriaPlacar &&
      !this.memoriaService.memoriaPlacar.cronometro) {
      this.periodo = 1;
      this.relogioService.parar();
      return '00:00:00';
    }
    return this.relogioService.tempo;
  }
}
