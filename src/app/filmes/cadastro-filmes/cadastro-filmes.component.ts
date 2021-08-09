import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { FilmesService } from 'src/app/core/filmes.service';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';
import { Alerta } from 'src/app/shared/models/alerta';
import { Filme } from 'src/app/shared/models/filme';

@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})
export class CadastroFilmesComponent implements OnInit {

  cadastro: FormGroup;
  generos:Array<string>;
  id:number;

  constructor(public validacao:ValidarCamposService,
    public dialog:MatDialog,
    private fb: FormBuilder,
    private filmeService: FilmesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    ) { }

  get f(){
    return this.cadastro.controls;
  }

  ngOnInit():void {
    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id)
    {
      this.filmeService.retornaUm(this.id).subscribe((filme:Filme) => {
        this.criaFormulario(filme)
      });
    }
    else{
      this.criaFormulario(this.criaFormularioembranco());
    }

    this.generos = [
      'Ação','Romance','Aventura',
      'Terror','Ficção Cinetífica'
      ,'Comédia','Drama',
    ]
  }

  submit():void{
    this.cadastro.markAllAsTouched();
    if (this.cadastro.invalid)
    {
      return;
    }
    const filme = this.cadastro.getRawValue() as Filme;
    if (this.id)
    {
      filme.id = this.id;
      this.editar(filme);
    }
    else
    {
      this.salvar(filme);
    }
  }

  reiniciarForm():void
  {
    this.cadastro.reset();
  }

  private salvar(filme: Filme):void
  {
    this.filmeService.salvar(filme).subscribe(()=>
    {
        const config = {
          data: {
            btnSucesso: 'Ir para listagem',
            btnCancelar: 'Cadastra novo Filme',
            corBtnCancelar: 'primary',
            btnFechar: true
          } as Alerta
        };
        const dialogRef = this.dialog.open(AlertaComponent,config);
        dialogRef.afterClosed().subscribe((op:boolean)=>{
          op ? this.router.navigateByUrl('filmes') : this.reiniciarForm();
        })
      },
      ()=>{
      const config = {
        data: {
          titulo: 'Erro ao salvar o registro',
          descricao:'Erro ao salvar o registro',
          corBtnSucesso: 'warn',
          btnSucesso: 'fechar'
        } as Alerta
      }
      this.dialog.open(AlertaComponent,config)
    })
  }

  private editar(filme: Filme):void
  {
    this.filmeService.editar(filme).subscribe(()=>
    {
        const config = {
          data: {
            descricao: 'Registro atualizado com sucesso!',
            btnSucesso: 'Ir para listagem',
          } as Alerta
        };
        const dialogRef = this.dialog.open(AlertaComponent,config);
        dialogRef.afterClosed().subscribe((op:boolean)=>{
          this.router.navigateByUrl('filmes');
        })
      },
      ()=>{
      const config = {
        data: {
          titulo: 'Erro!',
          descricao:'Erro ao editar o registro',
          corBtnSucesso: 'warn',
          btnSucesso: 'fechar'
        } as Alerta
      }
      this.dialog.open(AlertaComponent,config)
    })
  }

  private criaFormulario(filme:Filme):void{
    this.cadastro = this.fb.group({
      titulo:[filme.titulo,[Validators.required,
                  Validators.minLength(2),
                  Validators.maxLength(20)]],
      urlFoto:[filme.urlFoto,[Validators.minLength(10)]],
      dtLancamento:[filme.dtLancamento,[Validators.required]],
      descricao:[filme.descricao],
      nota:[filme.nota,[Validators.required,
                Validators.min(0),
                Validators.max(10)]],
      urlIMDb:[filme.urlIMDb,[Validators.minLength(10)]],
      genero:[filme.genero,[Validators.required]]
    });
  }
  private criaFormularioembranco(): Filme {
    return{
      id:null,
      titulo:null,
      dtLancamento:null,
      urlFoto:null,
      descricao:null,
      nota:null,
      urlIMDb:null,
      genero:null
    } as Filme
  }
}
