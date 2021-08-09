import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmesService } from 'src/app/core/filmes.service';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { Alerta } from 'src/app/shared/models/alerta';
import { Filme } from 'src/app/shared/models/filme';

@Component({
  selector: 'dio-visualizar-filmes',
  templateUrl: './visualizar-filmes.component.html',
  styleUrls: ['./visualizar-filmes.component.scss']
})
export class VisualizarFilmesComponent implements OnInit {

  filme:Filme;
  id:number;
  readonly semfoto = '../../assets/images/angular-material-post.png';

  constructor(public dialog:MatDialog,
              private activatedRoute: ActivatedRoute,
              private filmesService: FilmesService,
              private router: Router
              ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id']
    this.visualizar();
  }

  editar():void{
    this.router.navigateByUrl('/filmes/cadastro/'+this.id)
  }

  excluir():void{
    const config = {
      data: {
        titulo:'Deseja realmente excluir?',
        descricao: 'Se realmente deseja clique no botão OK',
        corBtnCancelar: 'primary',
        corBtnSucesso:'warn',
        btnFechar: true
      } as Alerta
    };
    const dialogRef = this.dialog.open(AlertaComponent,config);
    dialogRef.afterClosed().subscribe((op:boolean)=>{
      op && this.filmesService.excluir(this.id).subscribe(() => this.router.navigateByUrl('/filmes'));
    })
  }

  private visualizar():void{
    this.filmesService.retornaUm(this.id).subscribe((Filme:Filme)=>this.filme = Filme)
  }
}
